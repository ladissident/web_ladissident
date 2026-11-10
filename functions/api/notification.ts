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

export function createNotification(data: NotificationData): { subject: string; text: string } {
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
    `Nom i cognoms: ${oneLine(data.fullName)}`,
    `Correu: ${oneLine(data.email)}`,
    `Telèfon: ${oneLine(clean(data.phone))}`,
    `Quantitat aproximada: ${new Intl.NumberFormat('ca-ES').format(data.amount)} €`,
    `Termini preferit: ${field(data.preferences, termKey)}`,
    `Carència acceptada: ${grace}`,
    `Periodicitat: ${field(data.preferences, frequencyKey)}`,
    `Idioma: ${data.language === 'ca' ? 'Valencià' : 'Castellà'}`,
    `Comentaris: ${clean(data.comment)}`,
    `Consentiment per rebre novetats: ${data.newsletter ? 'Sí' : 'No'}`,
    '',
    'Avís automàtic. La base de dades D1 és la font principal de les sol·licituds.',
    'No s’ha formalitzat cap operació ni s’ha autoritzat cap transferència.'
  ];
  return {
    subject: `Nova sol·licitud de finançament | ${modeLabels[data.mode]} | ${data.code}`,
    text: lines.join('\n'),
  };
}

/** Retorna true només si Resend ha acceptat la notificació. No llança errors amb dades personals. */
export async function sendFinancingNotification(apiKey: string, data: NotificationData): Promise<{ ok: boolean; providerId?: string }> {
  const { subject, text } = createNotification(data);
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
