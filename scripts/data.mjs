/**
 * Black Flag NPC Generator — independent, original sample tables.
 * This file does NOT reproduce the Tales of the Valiant GMG's table entries.
 * The GM may load a local, privately prepared table pack through the UI.
 */
export const MODULE_ID = 'black-flag-npc-generator';
export const VERSION = '0.2.1';

export const TABLE_META = Object.freeze({
  ally: {label:'Ally concept', die:20, group:'roles'},
  antagonist: {label:'Antagonist concept', die:20, group:'roles'},
  background: {label:'Background concept', die:20, group:'roles'},
  questGiver: {label:'Quest-giver concept', die:20, group:'roles'},
  scheme: {label:'Villainous scheme', die:20, group:'roles'},
  name: {label:'Name', die:100, group:'details'},
  feature: {label:'Notable feature', die:20, group:'details'},
  profession: {label:'Profession', die:20, group:'details'},
  personality: {label:'Personality trait', die:20, group:'details'},
  bond: {label:'Bond', die:20, group:'details'},
  flaw: {label:'Flaw', die:20, group:'details'},
  want: {label:'Want', die:20, group:'details'}
});

const firstNames = [
  'Avel','Bressa','Corin','Dema','Erisel','Faerin','Galen','Hedra','Iona','Jorren',
  'Kaelis','Liora','Merrit','Nessa','Orven','Perrin','Quillan','Rissa','Sylven','Tovan'
];
const lastNames = ['Ashbriar','Coldwater','Duskfield','Ironreed','Mossmere'];
const sampleNames = firstNames.flatMap(first => lastNames.map(last => `${first} ${last}`));

export const DEFAULT_TABLES = Object.freeze({
  ally: [
    'Wandering mapmaker who owes the party a favor',
    'Village healer searching for a missing apprentice',
    'Retired caravan guard with a treasured old map',
    'A cautious river pilot who knows a secret crossing',
    'A courier carrying an unopened warning',
    'An amateur astronomer charting strange lights',
    'A novice knight trying to restore a ruined order',
    'An enthusiastic herbalist familiar with nearby hazards',
    'A reclusive archivist eager to recover lost letters',
    'A stubborn beekeeper whose hives sensed something wrong',
    'A traveling musician with contacts in every hamlet',
    'An escaped servant willing to expose their former master',
    'A curious mason who can read ancient construction marks',
    'A priest tending a shrine the locals have abandoned',
    'A woodsman preserving a forgotten trail',
    'A merchant seeking safe passage home',
    'A messenger who mistakenly thinks the party are old friends',
    'An animal keeper who understands unusual tracks',
    'A former rival ready to make amends',
    'A guild inspector quietly investigating corruption'
  ],
  antagonist: [
    'A toll collector demanding payment for an invented law',
    'A jealous explorer racing to claim a buried relic',
    'A temple official concealing a dangerous mistake',
    'A bandit captain trying to secure legitimate influence',
    'A magistrate enforcing an unjust decree',
    'A reckless scholar opening sealed chambers',
    'An impostor trading on another person’s reputation',
    'A war veteran recruiting followers for a private feud',
    'A hedge mage selling miracles they cannot control',
    'A mercenary lieutenant ordered to silence witnesses',
    'A landlord driving families from valuable land',
    'A desperate smuggler hiding contraband among supplies',
    'A noble heir trying to discredit a more capable sibling',
    'A secretive hunter who sees the party as prey',
    'An ambitious apprentice sabotaging their master',
    'A relic broker funding tomb robberies',
    'A suspicious watch officer looking for scapegoats',
    'A prophet spreading a fabricated omen',
    'A rival envoy intent on sabotaging a peace accord',
    'A commander concealing the loss of a strategic outpost'
  ],
  background: [
    'A sleepy gate attendant keeping meticulous notes',
    'A baker preparing for a village celebration',
    'A shoemaker who remembers every customer',
    'A ferryman arguing with the river’s changing course',
    'A shepherd searching for a wandering lamb',
    'A street performer with a surprisingly serious hobby',
    'A gardener tending flowers over an unmarked grave',
    'A market porter who knows local gossip',
    'A cartwright struggling with an impossible order',
    'A child’s tutor practicing speeches between lessons',
    'A laundress collecting stories from travelers',
    'A scribe who illustrates everything in the margins',
    'A watch recruit anxious about their first patrol',
    'A spice vendor with an extraordinary sense of smell',
    'A stablehand training an unusually clever mule',
    'A bell ringer who is always five minutes late',
    'A cobbler hosting a neighborhood chess competition',
    'A woodcutter convinced a tree is following them',
    'A brewer attempting a new winter recipe',
    'A bridge caretaker who tracks every crossing'
  ],
  questGiver: [
    'Needs an heirloom returned before an upcoming wedding',
    'Wants someone to confirm a missing caravan reached safety',
    'Requests a discreet meeting with a distant family member',
    'Offers payment to clear an overgrown road',
    'Needs witnesses to recover stolen records',
    'Seeks protection for a rare migrating animal',
    'Offers a reward for solving unexplained bell-ringing',
    'Needs a message delivered without attracting attention',
    'Wants proof a local landmark is not cursed',
    'Requests escorts for a hazardous night crossing',
    'Needs a lost charter recovered from old ruins',
    'Offers supplies to anyone who can repair an ancient pump',
    'Needs help negotiating with an isolated settlement',
    'Seeks a missing apprentice last seen near a shrine',
    'Wants a mysterious parcel returned to its rightful owner',
    'Requests that a witness be found before a hearing',
    'Needs medicine gathered before the roads close',
    'Offers a map in return for retrieving an old survey',
    'Asks the party to investigate counterfeit guild seals',
    'Needs safe passage for a diplomatic exchange'
  ],
  scheme: [
    'Discredit a respected protector of the settlement',
    'Monopolize the only reliable river crossing',
    'Frame a rival household for a series of thefts',
    'Steal an archive before its records are made public',
    'Arrange an election whose result is decided in advance',
    'Awaken a buried construct to enforce a private claim',
    'Keep a border dispute alive to profit from conflict',
    'Replace a town landmark with an enchanted duplicate',
    'Acquire a lost title deed by any means',
    'Divert a pilgrimage to a false shrine',
    'Purchase the loyalty of the city watch',
    'Ruin the harvest to drive down farmland prices',
    'Control a guild by blackmailing its candidates',
    'Smuggle an artifact through a ceremonial procession',
    'Trigger a panic so an ally can appear heroic',
    'Cause the evacuation of a strategically useful village',
    'Erase evidence of a broken ancestral pact',
    'Open a forbidden road between two realms',
    'Manipulate succession to place a puppet on the throne',
    'Silence everyone who knows the true cause of a fire'
  ],
  name: sampleNames,
  feature: [
    'wears one glove even in warm weather',
    'has silver hair at an unexpectedly young age',
    'carries a notebook tied with red cord',
    'speaks with a faint rasp after every sentence',
    'has mismatched earrings',
    'smells faintly of cedar and rain',
    'always wears boots polished to a mirror shine',
    'has a small burn scar under one eyebrow',
    'keeps a tiny brass bell at their belt',
    'has an ink-stained thumb',
    'wears a cloak with many careful repairs',
    'has an elaborate braid threaded with copper wire',
    'uses a walking stick carved with birds',
    'has unusually bright green eyes',
    'wears a faded ribbon from a bygone festival',
    'has one tooth capped with gold',
    'constantly adjusts a crooked collar',
    'wears a ring made from woven reeds',
    'has a tattoo of three falling leaves',
    'has laugh lines contrasting a stern expression'
  ],
  profession: [
    'Cartographer','Watch officer','Apothecary','Innkeeper','Archivist',
    'Wheelwright','Village reeve','Herbalist','Stonemason','Ferry operator',
    'Courier','Bookbinder','Beekeeper','Market broker','Stablemaster',
    'Tailor','Priest','Guide','Glassblower','Surveyor'
  ],
  personality: [
    'makes everyone feel listened to',
    'talks rapidly when nervous',
    'distrusts anyone who refuses a direct question',
    'is kind to strangers but stern with friends',
    'turns nearly every conversation into a competition',
    'uses elaborate metaphors for simple facts',
    'prefers silence to small talk',
    'offers hospitality even when suspicious',
    'is quick to laugh at their own mistakes',
    'always asks for the practical details first',
    'treats tradition as a personal obligation',
    'is relentlessly curious about distant places',
    'seems gloomy but is secretly optimistic',
    'never speaks poorly of an absent person',
    'is impatient with titles and ceremony',
    'collects and remembers trivial facts',
    'tends to answer questions with questions',
    'is wary but extraordinarily dependable',
    'believes every disagreement can be settled over food',
    'takes everything literally until proven otherwise'
  ],
  bond: [
    'looks after an ill parent',
    'has promised to protect the old bridge',
    'sends money to an estranged sibling',
    'is loyal to a mentor who disappeared years ago',
    'cares for an injured hunting hound',
    'maintains an abandoned wayside shrine',
    'is devoted to restoring their family workshop',
    'owes their life to a passing stranger',
    'feels responsible for the village children',
    'has sworn never to abandon their crew',
    'keeps a grave clean despite not knowing who lies there',
    'belongs to a small circle of amateur historians',
    'honors a promise made to a rival',
    'safeguards a letter entrusted to them',
    'returns every spring to a particular tree',
    'works to repay a guild debt',
    'protects a younger apprentice from scrutiny',
    'believes a lost relative is still alive',
    'is deeply attached to a crumbling family home',
    'serves a local cause more faithfully than its leaders'
  ],
  flaw: [
    'cannot admit they are wrong',
    'keeps taking unnecessary risks to impress others',
    'is easily manipulated by praise',
    'refuses help even when overwhelmed',
    'shares secrets when excited',
    'judges everyone by their clothing',
    'holds grudges for years',
    'is terrified of deep water',
    'cannot stop gambling on unlikely outcomes',
    'habitually makes promises they cannot keep',
    'lies about insignificant details',
    'is obsessed with winning a forgotten argument',
    'believes every coincidence is an omen',
    'keeps a dangerous possession for sentimental reasons',
    'will sacrifice tomorrow’s plans to avoid discomfort today',
    'trusts written words over personal experience',
    'has a weakness for expensive gifts',
    'assumes betrayal wherever there is disagreement',
    'becomes reckless when family is mentioned',
    'will not forgive a single public humiliation'
  ],
  want: [
    'earn enough to leave town forever',
    'clear their family name',
    'find the maker of a strange instrument',
    'win a seat on the guild council',
    'reunite two estranged friends',
    'recover a stolen inheritance',
    'discover why the wells run cold at night',
    'secure safe travel for a loved one',
    'be remembered for something noble',
    'prove an old legend was true',
    'build a refuge for displaced travelers',
    'keep a personal mistake from becoming public',
    'restore an ancient footpath',
    'earn the respect of a skeptical mentor',
    'expose the person funding local raiders',
    'retire before the next winter',
    'gain access to a restricted archive',
    'protect an unusual creature from hunters',
    'repay a debt without revealing its source',
    'stop a feud before someone is killed'
  ]
});

const PRIMARY_ROLES = ['ally','antagonist','background'];
export const DEFAULT_OPTIONS = Object.freeze({
  role:'background', questGiver:false, villainousScheme:false,
  mode:'full', fields:['name','feature','profession','personality','bond','flaw','want'],
  useAttitude:false, attitude:'indifferent', useStatus:false, status:0
});
const DETAILS = ['name','feature','profession','personality','bond','flaw','want'];

export function normalizeOptions(options={}) {
  const input = {...DEFAULT_OPTIONS, ...options};
  return {
    ...input,
    role: PRIMARY_ROLES.includes(input.role) ? input.role : 'background',
    mode: ['quick','full','custom'].includes(input.mode) ? input.mode : 'full',
    fields: Array.isArray(input.fields) ? [...new Set(input.fields.filter(key=>DETAILS.includes(key)))] : [...DETAILS],
    questGiver: Boolean(input.questGiver), villainousScheme: Boolean(input.villainousScheme),
    useAttitude:Boolean(input.useAttitude), useStatus:Boolean(input.useStatus),
    status: Number.isFinite(Number(input.status)) ? Math.max(-5,Math.min(5,Number(input.status))) : 0
  };
}
export function activeKeys(input) {
  const cfg = normalizeOptions(input);
  const base = [cfg.role];
  if (cfg.questGiver) base.push('questGiver');
  if (cfg.role === 'antagonist' && cfg.villainousScheme) base.push('scheme');
  if (cfg.mode === 'quick') return [...base,'name','feature','personality'];
  if (cfg.mode === 'full') return [...base,...DETAILS];
  return [...base,...cfg.fields];
}
export function combineTables(overrides={}) {
  return Object.fromEntries(Object.keys(TABLE_META).map(key=>[key, overrides[key] ?? DEFAULT_TABLES[key]]));
}
/** Both an entire pack and a partial override pack are valid. Values must be plain strings. */
export function validateTablePack(pack) {
  if (typeof pack !== 'object' || pack === null || Array.isArray(pack)) throw new Error('Table pack must be a JSON object.');
  const source = pack.tables && typeof pack.tables === 'object' && !Array.isArray(pack.tables) ? pack.tables : pack;
  const result={};
  for (const [key, value] of Object.entries(source)) {
    if (!(key in TABLE_META)) throw new Error(`Unknown table: ${key}`);
    if (!Array.isArray(value) || value.length!==TABLE_META[key].die) {
      throw new Error(`${key} must contain exactly ${TABLE_META[key].die} entries.`);
    }
    if (value.some(item=>typeof item!=='string' || !item.trim() || item.length>800)) {
      throw new Error(`${key} contains an invalid entry. Use non-empty strings of at most 800 characters.`);
    }
    result[key]=value.map(item=>item.trim());
  }
  if (!Object.keys(result).length) throw new Error('Import at least one table.');
  return result;
}
/** Uniform index, 1..die; injection makes rolls easy to test. */
export function draw(key,tables=DEFAULT_TABLES,random=Math.random) {
  const meta=TABLE_META[key];
  if(!meta) throw new Error(`Unknown table: ${key}`);
  const entries=tables[key];
  if(!Array.isArray(entries) || entries.length!==meta.die) throw new Error(`Invalid entries for ${key}`);
  const n=random();
  if(typeof n!=='number' || !Number.isFinite(n) || n<0 || n>1) throw new Error('Random generator must return a number from 0 through 1.');
  const roll=Math.min(meta.die,Math.floor(n*meta.die)+1);
  return {key, roll, die:meta.die, text:entries[roll-1]};
}
export function generateNpc(options={},tables=DEFAULT_TABLES,random=Math.random,existing={},locked=[]) {
  const config=normalizeOptions(options);
  const keys=activeKeys(config);
  const hold = new Set(locked);
  const result={};
  for(const key of keys) result[key]=hold.has(key) && existing[key] ? {...existing[key]} : draw(key,tables,random);
  return result;
}