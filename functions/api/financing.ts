import { sendFinancingNotification } from './notification';
interface Env { DB: D1Database; TURNSTILE_SECRET_KEY: string; RESEND_API_KEY?: string; }
type Context = { request: Request; env: Env };
const allowed = {
  loan: { loanRemuneration:['zero','ipc','both'], loanYears:['1','2','3','5','7','10','none','discuss'], loanFrequency:['monthly','quarterly','semiannual','annual','none'], loanGrace:['2','6','12','24','more','discuss'], loanFlexibility:['fixed','early','small','flexible','discuss'] },
  member: { memberRemuneration:['zero','ipc','both'], memberYears:['2','3','5','7','10','none'], memberFrequency:['monthly','quarterly','annual','maturity','flexible'], memberPriority:['short','medium','long','explain'] },
  undecided: { needStart:['2months','1year','later','unsure'], preferredYears:['1','2','3','5','7','10','none'], preferredGrace:['none','6','12','24','more'], preferredFrequency:['monthly','quarterly','semiannual','annual','none'] }
} as const;
const reject = (error:string, status=400) => Response.json({ok:false,error},{status,headers:{'Cache-Control':'no-store'}});
const str=(obj:Record<string,unknown>,key:string,max=200) => typeof obj[key]==='string' && (obj[key] as string).trim().length <= max ? (obj[key] as string).trim() : null;
const bool=(x:unknown)=> x===true || x==='on' || x==='true';
export async function onRequestPost({request,env}:Context):Promise<Response>{
  if (!env.DB || !env.TURNSTILE_SECRET_KEY) return reject('service_not_configured',503);
  if ((Number(request.headers.get('content-length')||'0'))>16000) return reject('payload_too_large',413);
  // Comprovar origen; no confondre-ho amb una protecció antispam.
  const origin=request.headers.get('Origin');
  if (origin && origin!==new URL(request.url).origin) return reject('invalid_origin',403);
  let obj:Record<string,unknown>;
  try { const body=await request.text(); if(body.length>16000)return reject('payload_too_large',413); obj=JSON.parse(body); if(!obj || Array.isArray(obj) || typeof obj!=='object')return reject('invalid_body'); } catch{return reject('invalid_json');}
  const token=str(obj,'cf-turnstile-response',2048);
  if (!token) return reject('missing_verification');
  try{
    const verification=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:token})});
    const result=await verification.json() as {success:boolean};
    if(!result.success)return reject('verification_failed',403);
  }catch{return reject('verification_unavailable',503);}
  const mode=str(obj,'financeMode',20) as keyof typeof allowed;
  if (!Object.prototype.hasOwnProperty.call(allowed,mode))return reject('invalid_mode');
  const fullName=str(obj,'fullName',120),email=str(obj,'email',254),phone=str(obj,'phone',40),locality=str(obj,'location',120),lang=str(obj,'preferredLanguage',2),comment=str(obj,'comment',1000);
  const rawAmount=obj.amount;
  const amount= typeof rawAmount==='string' && /^\d+$/.test(rawAmount)? Number(rawAmount):NaN;
  if(!fullName || fullName.length<2 || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !['ca','es'].includes(lang||''))return reject('invalid_contact');
  if(phone===null||locality===null||comment===null)return reject('invalid_field');
  if(!Number.isSafeInteger(amount)||amount<3000||amount>1000000||(mode==='member'&&amount>50000))return reject('invalid_amount');
  if(!bool(obj.understanding)||!bool(obj.noTransfer))return reject('missing_acknowledgement');
  const prefs:Record<string,string>={};
  const modeFields=allowed[mode] as Record<string,readonly string[]>;
  for(const [key,valid] of Object.entries(modeFields)){
    const val=str(obj,key,40);
    if(!val || !valid.includes(val))return reject('invalid_preference_'+key);
    prefs[key]=val;
  }
  const id=crypto.randomUUID();
  const code='LD-'+id.slice(0,8).toUpperCase();
  const createdAt = new Date().toISOString();
  const newsletter = bool(obj.newsletter);
  try{
    await env.DB.prepare(`INSERT INTO financing_requests (id,code,created_at,mode,full_name,email,phone,locality,preferred_language,amount_eur,preferences_json,comment,newsletter_consent,notice_acknowledged,transfer_acknowledged) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,1,1)`)
      .bind(id,code,createdAt,mode,fullName,email,phone||null,locality||null,lang,amount,JSON.stringify(prefs),comment||null,newsletter?1:0).run();

    // Guardem primer en D1. Si falla Resend, la persona rep igualment confirmació.
    // El codi de la petició només es genera una vegada i no es duplica el registre.
    if (env.RESEND_API_KEY) {
      const result = await sendFinancingNotification(env.RESEND_API_KEY, {
        id, code, createdAt, mode, fullName, email, phone: phone || null, locality: locality || null,
        amount, preferences: prefs, language: lang!, comment: comment || null, newsletter,
      });
      // Si falla l'actualització d'estat, no invalidem la sol·licitud ja registrada.
      try {
        await env.DB.prepare(`UPDATE financing_requests SET notification_status = ?, notification_attempts = 1,
          notification_sent_at = ?, notification_provider_id = ?, updated_at = ? WHERE id = ?`)
          .bind(result.ok ? 'sent' : 'failed', result.ok ? new Date().toISOString() : null,
            result.providerId || null, new Date().toISOString(), id).run();
      } catch {
        console.error('Financing notification status update failed');
      }
    } else {
      try {
        await env.DB.prepare(`UPDATE financing_requests SET notification_status = 'not_configured', updated_at = ? WHERE id = ?`)
          .bind(new Date().toISOString(), id).run();
      } catch {
        console.error('Financing notification status update failed');
      }
    }
    return Response.json({ok:true,code},{status:201,headers:{'Cache-Control':'no-store'}});
  }catch(err){console.error('D1 financing insert failed',err);return reject('storage_error',503);}
}
export function onRequestGet(){return reject('method_not_allowed',405);}
