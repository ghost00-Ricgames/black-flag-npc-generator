/**
 * ChatGPT prompt helpers are deliberately independent of Foundry, so prompt
 * creation and safe Biography formatting can be regression-tested offline.
 */
export const AI_MODES = Object.freeze({
  off: 'Off — no ChatGPT required',
  manual: 'ChatGPT Prompt (copy and paste) — Free or paid ChatGPT account'
});

export const AI_REQUIREMENTS = Object.freeze({
  off: 'AI-assisted background writing is disabled. Normal NPC generation still works.',
  manual: 'Works with ChatGPT Free, Go, Plus, or Pro. Copy the generated prompt to ChatGPT and paste the response back. No API key, separate API billing, or direct account connection required.'
});

/** Existing worlds may have a v0.2.0 provider saved; treat it as prompt-only. */
export function aiModeFromSettings(setting) {
  if (setting === 'manual' || setting === 'chatgpt' || setting === 'api') return 'manual';
  return 'off';
}

const simple = (s, max=1500) => String(s ?? '').trim().slice(0,max);
const FIELDS = {
  ally:'Ally concept',antagonist:'Antagonist concept',background:'Background character concept',
  questGiver:'Quest-giver role',scheme:'Villainous scheme',name:'Name',feature:'Appearance',
  profession:'Profession',personality:'Personality',bond:'Bond',flaw:'Flaw',want:'Want'
};

/** Build a standalone, copy-friendly prompt from the *edited* (not default) NPC characteristics. */
export function buildBackgroundPrompt(record,{length='detailed',tone='grounded fantasy',context=''}={}) {
  if(!record || !record.options || !record.fields) throw new TypeError('NPC data is missing.');
  const wordTargets={brief:'120–180',detailed:'260–400',extensive:'550–750'};
  const words=wordTargets[length] || wordTargets.detailed;
  const safeTone=['grounded fantasy','dark fantasy','heroic fantasy','comedic'].includes(tone)?tone:'grounded fantasy';
  const lines=Object.entries(record.fields).filter(([key,v])=>key in FIELDS && v?.text)
    .map(([key,v])=>`- ${FIELDS[key]}: ${simple(v.text)}`);
  const options=record.options;
  const social=[];
  if(options.useAttitude) social.push(`- Starting attitude: ${simple(options.attitude,100)}`);
  if(options.useStatus) social.push(`- Faction status: ${simple(options.faction||'Unspecified faction',100)} (${Number(options.status)||0})`);
  const campaign=simple(context,1200);
  return [
    `Write an original, playable ${safeTone} backstory (${words} words) for a Tales of the Valiant/5e NPC.`,
    'Use the NPC details as fixed facts; resolve surprising combinations plausibly rather than changing them. Do not invent combat abilities, statistics, or important established campaign facts.',
    'Avoid generic fantasy tropes, purple prose and forced plot twists. Give the GM specific details useful at the table.',
    `Base role: ${simple(options.role,100)}${options.questGiver?' (also a quest giver)':''}.`,
    ...(lines.length?['NPC details:',...lines]:[]),
    ...(social.length?['Social notes:',...social]:[]),
    ...(campaign?['Campaign context (use only as setting guidance):',campaign]:[]),
    'Write these sections with plain-text headings: Background; Public Demeanor; Private Truth; Adventure Hook; Roleplaying Cues.',
    'Keep the public demeanor consistent with the NPC traits. The private truth is GM-only. Output ONLY the NPC background text, without markdown code fences.'
  ].join('\n');
}

export function backgroundToHtml(value) {
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const text=simple(value,15000);
  if(!text) return '';
  // Render as safe plain text; never execute returned model HTML or JavaScript.
  return `<h2>NPC Background</h2><div class="bfng-background">${esc(text).replace(/\r\n|\r|\n/g,'<br>')}</div>`;
}