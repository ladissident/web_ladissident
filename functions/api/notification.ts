/** Avís intern per Resend. D1 continua sent la font de veritat. */
export interface NotificationData {
  id: string;
  code: string;
  createdAt: string;
  mode: 'loan' | 'member' | 'undecided';
  fullName: string;
  email: string;
  phone: string | null;
  amount: number;
  preferences: Record<string, string>;
  language: string;
  comment: string | null;
  newsletter: boolean;
}

const modeLabels: Record<NotificationData['mode'], string> = {
  loan: 'Préstec personal',
  member: 'Persona associada',
  undecided: 'No tinc clar quina opció triar',
};

const maps: Record<string, Record<string, string>> = {
  memberRemuneration: {zero:'Aportació al 0 %',ipc:'Compensació limitada segons IPC (màxim 3 % anual, a partir del segon any)',both:'Vol comparar les dues modalitats'},
  loanYears: {'1':'1 any','2':'2 anys','3':'3 anys','5':'5 anys','7':'7 anys','10':'10 anys',none:'Sense preferència',discuss:'Vol parlar-ne'},
  memberYears: {'2':'2 anys','3':'3 anys','5':'5 anys','7':'7 anys','10':'10 anys',none:'Sense preferència'},
  preferredYears: {'1':'1 any','2':'2 anys','3':'3 anys','5':'5 anys','7':'7 anys','10':'10 anys',none:'Sense preferència'},
  loanGrace: {'2':'Només 2 mesos inicials','6':'Fins a 6 mesos en total','12':'Fins a 12 mesos','24':'Fins a 24 mesos',more:'Més temps',discuss:'Vol parlar-ne'},
  preferredGrace: {none:'No','6':'Fins a 6 mesos','12':'Fins a 12 mesos','24':'Fins a 24 mesos',more:'Més temps'},
  loanFrequency: {monthly:'Mensual',quarterly:'Trimestral',semiannual:'Semestral',annual:'Anual',none:'Sense preferència'},
  memberFrequency: {monthly:'Mensual',quarterly:'Trimestral',annual:'Anual',maturity:'Al venciment',flexible:'Flexible segons liquiditat'},
  preferredFrequency: {monthly:'Mensual',quarterly:'Trimestral',semiannual:'Semestral',annual:'Anual',none:'Sense preferència'},
};
const field = (prefs: Record<string, string>, key: string) => {
  const value = prefs[key];
  return value ? (maps[key]?.[value] ?? value) : 'No aplicable';
};
const clean = (s: string | null | undefined) => (s?.trim() || 'No facilitat');
const oneLine = (s: string) => s.replace(/[\r\n\t]+/g, ' ').trim();
const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export function createNotification(data: NotificationData): { subject: string; text: string; html: string } {
  const termKey = data.mode === 'loan' ? 'loanYears' : data.mode === 'member' ? 'memberYears' : 'preferredYears';
  const grace = data.mode === 'loan' ? field(data.preferences, 'loanGrace') : data.mode === 'undecided' ? field(data.preferences, 'preferredGrace') : 'No aplicable';
  const frequencyKey = data.mode === 'loan' ? 'loanFrequency' : data.mode === 'member' ? 'memberFrequency' : 'preferredFrequency';
  const date = new Intl.DateTimeFormat('ca-ES', {
    timeZone: 'Europe/Madrid', dateStyle: 'short', timeStyle: 'medium'
  }).format(new Date(data.createdAt));
  const lines = [
    'Nova sol·licitud de finançament — La Dissident',
    '',
    `Codi de sol·licitud: ${data.code}`,
    `Data i hora (peninsular): ${date}`,
    `Modalitat: ${modeLabels[data.mode]}`,
    ...(data.mode === 'member' ? [`Modalitat econòmica de persona associada: ${field(data.preferences, 'memberRemuneration')}`] : []),
    `Nom i cognoms: ${oneLine(data.fullName)}`,
    `Correu: ${oneLine(data.email)}`,
    `Telèfon: ${oneLine(clean(data.phone))}`,
    `Quantitat aproximada: ${new Intl.NumberFormat('ca-ES').format(data.amount)} €`,
    `Termini preferit: ${field(data.preferences, termKey)}`,
    `Carència acceptada: ${grace}`,
    `Periodicitat: ${field(data.preferences, frequencyKey)}`,
    `Idioma: ${data.language === 'ca' ? 'Valencià' : 'Castellà'}`,
    `Comentaris: ${clean(data.comment)}`,
    `Consentiment per rebre novetats: ${data.newsletter ? 'Sí' : 'No'}`
  ];
  const rows = lines.slice(2).map(line => {
    const separator = line.indexOf(': ');
    const label = separator >= 0 ? line.slice(0, separator) : line;
    const value = separator >= 0 ? line.slice(separator + 2) : '';
    return `<tr><th style="text-align:left;vertical-align:top;padding:8px 16px 8px 0;font-weight:700;">${escapeHtml(label)}</th><td style="padding:8px 0;font-weight:400;vertical-align:top;white-space:pre-wrap;overflow-wrap:anywhere;">${escapeHtml(value)}</td></tr>`;
  }).join('');
  const html = `<!doctype html><html lang="ca"><head><meta charset="utf-8"></head><body style="font-family:Arial,Helvetica,sans-serif;color:#3B2A22;line-height:1.5;"><div style="max-width:700px;margin:0 auto;"><h2 style="font-size:20px;">Nova sol·licitud de finançament — La Dissident</h2><table role="presentation" style="border-collapse:collapse;width:100%;font-size:14px;">${rows}</table></div></body></html>`;
  return {
    subject: `Nova sol·licitud de finançament | ${modeLabels[data.mode]} | ${data.code}`,
    text: lines.join('\n'),
    html,
  };
}

/** Retorna true només si Resend ha acceptat la notificació. No llança errors amb dades personals. */
export async function sendFinancingNotification(apiKey: string, data: NotificationData): Promise<{ ok: boolean; providerId?: string }> {
  const { subject, text, html } = createNotification(data);
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'LaDissidentWorker/1.0',
        'Idempotency-Key': `financing-notification-${data.id}`,
      },
      body: JSON.stringify({
        from: 'La Dissident <notificacions@ladissident.org>',
        to: ['hola@ladissident.org'],
        subject,
        text,
        html,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return { ok: false };
    const parsed = await response.json() as { id?: unknown };
    return { ok: true, providerId: typeof parsed.id === 'string' ? parsed.id : undefined };
  } catch {
    return { ok: false };
  }
}
