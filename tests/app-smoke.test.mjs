import test from 'node:test';
import assert from 'node:assert/strict';

const settings=new Map([['black-flag-npc-generator.customTables',{}]]);
globalThis.foundry={applications:{api:{ApplicationV2:class {constructor(){} _onRender(){} }}}};
globalThis.game={
 user:{isGM:true},
 settings:{get:(namespace,key)=>settings.get(`${namespace}.${key}`)},
 actors:{contents:[{type:'npc',name:'Example NPC',uuid:'Actor.test123'}]}
};
const {NpcGeneratorApp}=await import('../scripts/generator.mjs');

test('ApplicationV2 renders complete UI without Foundry runtime',async()=>{
 const app=new NpcGeneratorApp();
 const markup=await app._renderHTML();
 assert(markup.includes('NPC Workshop'));
 assert(markup.includes('data-action="journal"'));
 assert(markup.includes('data-action="actor"'));
 assert(markup.includes('data-option="questGiver"'));
 assert(markup.includes('Actor.test123'));
 assert(!markup.includes('data-action="roll" data-key="scheme"'));
});
test('Antagonist scheme and quest giver are independently visible',async()=>{
 const app=new NpcGeneratorApp();
 app.config.role='antagonist';app.config.villainousScheme=true;app.config.questGiver=true;
 let markup=await app._renderHTML();
 assert(markup.includes('data-action="roll" data-key="scheme"'));
 assert(markup.includes('data-action="roll" data-key="questGiver"'));
 app.config.villainousScheme=false;
 markup=await app._renderHTML();
 assert(!markup.includes('data-action="roll" data-key="scheme"'));
 assert(markup.includes('data-action="roll" data-key="questGiver"'));
});

test('Prompt-only selection reveals copy/paste controls without unavailable providers',async()=>{
 settings.set('black-flag-npc-generator.aiMode','manual');
 const app=new NpcGeneratorApp();
 let markup=await app._renderHTML();
 assert(markup.includes('data-action="copy-ai"'));
 assert(markup.includes('data-action="open-ai"'));
 assert(markup.includes('ChatGPT Free, Go, Plus, or Pro'));
 assert(markup.includes('data-ai="background"'));
 assert(!markup.includes('data-action="request-ai"'));
 assert(!markup.includes('data-ai="token"'));
 assert(!markup.includes('Local API Bridge'));
 // Old saved selections must use only the copy/paste UI until migrated.
 settings.set('black-flag-npc-generator.aiMode','api');
 markup=await app._renderHTML();
 assert(markup.includes('data-action="copy-ai"'));
 assert(!markup.includes('data-action="request-ai"'));
 settings.set('black-flag-npc-generator.aiMode','off');
 markup=await app._renderHTML();
 assert(!markup.includes('data-action="copy-ai"'));
});

test('biography helper writes fresh generated notes into the Black Flag NPC field' , async()=>{
  const {addNpcBiography}=await import('../scripts/generator.mjs');
  const actor={type:'npc'};
  const result=addNpcBiography(actor,'<h2>NPC overview</h2><p>A helpful wanderer</p>');
  assert.equal(result,actor);
  assert.equal(actor.system.biography.value,'<h2>NPC overview</h2><p>A helpful wanderer</p>');
});

test('biography helper appends rather than overwriting a stat template biography', async()=>{
  const {addNpcBiography}=await import('../scripts/generator.mjs');
  const actor={system:{attributes:{cr:4},biography:{value:'<p>Original NPC history</p>',legendary:'<p>Legendary text</p>'}}};
  addNpcBiography(actor,'<h2>NPC overview</h2><p>New lore</p>');
  assert.equal(actor.system.biography.value,'<p>Original NPC history</p>\n<hr>\n<h2>NPC overview</h2><p>New lore</p>');
  assert.equal(actor.system.biography.legendary,'<p>Legendary text</p>');
  assert.equal(actor.system.attributes.cr,4);
});

async function saveNpcFromMockUi(app){
  const listeners={};
  app.element={querySelector:()=>({addEventListener:(type,handler)=>{listeners[type]=handler;}})};
  app._onRender();
  await listeners.click({target:{closest:()=>({dataset:{action:'actor'},disabled:false})},preventDefault(){}});
}

test('Create NPC Actor populates Biography with every generated field and social option',async()=>{
  const {generateNpc,DEFAULT_TABLES}=await import('../scripts/data.mjs');
  let created;
  globalThis.ui={notifications:{info(){},error(message){throw new Error(message);}}};
  globalThis.Actor={create:async data=>{created=data;return {sheet:{render(){}}};}};
  globalThis.foundry.utils={deepClone:obj=>structuredClone(obj)};
  const app=new NpcGeneratorApp();
  app.config.role='antagonist';
  app.config.questGiver=true;
  app.config.villainousScheme=true;
  app.config.mode='full';
  app.config.useAttitude=true;
  app.config.attitude='hostile';
  app.config.useStatus=true;
  app.config.status=-3;
  app.config.faction='Town Council';
  app.results=generateNpc(app.config,DEFAULT_TABLES,()=>0);
  app.results.flaw.text='<untrusted NPC text> & more';
  await saveNpcFromMockUi(app);
  const bio=created.system.biography.value;
  for(const text of ['NPC overview','Role:','Antagonist concept','Quest-giver concept','Villainous scheme','Name:','Notable feature','Profession','Personality trait','Bond:','Flaw:','Want:','Attitude:','Faction status:','Town Council']) assert(bio.includes(text),text);
  assert(bio.includes('&lt;untrusted NPC text&gt; &amp; more'));
  assert.equal(created.flags['black-flag-npc-generator'].generated.fields.flaw.text,'<untrusted NPC text> & more');
});

test('Generated AI background is appended safely to Actor Biography and structured flags',async()=>{
 let created;
 settings.set('black-flag-npc-generator.aiMode','manual');
 globalThis.ui={notifications:{info(){},error(message){throw new Error(message);}}};
 globalThis.Actor={create:async data=>{created=data;return {sheet:{render(){}}};}};
 const app=new NpcGeneratorApp();
 app.ai.background='Secret history\n<script>bad()</script> & some secrets';
 await saveNpcFromMockUi(app);
 assert.match(created.system.biography.value,/<h2>NPC Background<\/h2>/);
 assert(created.system.biography.value.includes('Secret history<br>&lt;script&gt;bad()&lt;/script&gt; &amp; some secrets'));
 assert.equal(created.flags['black-flag-npc-generator'].generated.aiBackground.text,app.ai.background);
 assert(!JSON.stringify(created).includes('access_token'));
 settings.set('black-flag-npc-generator.aiMode','off');
});

test('Create NPC Actor using existing NPC statistics preserves original biography' ,async()=>{
  let created;
  globalThis.ui={notifications:{info(){},error(message){throw new Error(message);}}};
  globalThis.Actor={create:async data=>{created=data;return {sheet:{render(){}}};}};
  globalThis.foundry.utils={deepClone:obj=>structuredClone(obj)};
  const original={_id:'original-id',name:'Source NPC',type:'npc',system:{attributes:{cr:9},biography:{value:'<p>Existing template lore</p>',legendary:'<p>Keep me</p>'}},flags:{anotherModule:{persist:true}},prototypeToken:{name:'Source NPC'}};
  globalThis.fromUuid=async()=>({documentName:'Actor',type:'npc',toObject:()=>original});
  const app=new NpcGeneratorApp();
  app.actorTemplate='Actor.source';
  await saveNpcFromMockUi(app);
  assert.equal(created._id,undefined);
  assert.equal(created.system.attributes.cr,9);
  assert(created.system.biography.value.startsWith('<p>Existing template lore</p>\n<hr>\n<h2>NPC overview</h2>'));
  assert.equal(created.system.biography.legendary,'<p>Keep me</p>');
  assert.equal(original.system.biography.value,'<p>Existing template lore</p>');
  assert.equal(created.flags.anotherModule.persist,true);
  assert.equal(created.prototypeToken.name,created.name);
});


test('Compact layout keeps individual fields and actions accessible',async()=>{
 const app=new NpcGeneratorApp();
 const markup=await app._renderHTML();
 assert(markup.includes('class="bfng-result-head"'));
 assert(markup.includes('aria-label="Reroll'));
 assert(markup.includes('aria-label="Lock'));
 assert(markup.includes('data-field="name"'));
 assert(markup.includes('data-action="actor"'));
});

test('Optional panels are collapsed by default and can retain their expanded state',async()=>{
 settings.set('black-flag-npc-generator.aiMode','manual');
 const app=new NpcGeneratorApp();
 let markup=await app._renderHTML();
 for(const panel of ['social','tables','ai']){
  assert(markup.includes(`data-panel="${panel}"`));
  assert(!markup.includes(`data-panel="${panel}" open`));
  app.expandedPanels.add(panel);
 }
 markup=await app._renderHTML();
 for(const panel of ['social','tables','ai'])assert(markup.includes(`data-panel="${panel}" open`));
 settings.set('black-flag-npc-generator.aiMode','off');
});


test('Rerendering keeps the workshop scroll position',()=>{
 const app=new NpcGeneratorApp();
 const container={scrollTop:275,innerHTML:'old'};
 app._replaceHTML('<p>new</p>',container);
 assert.equal(container.scrollTop,275);
 assert.equal(container.innerHTML,'<p>new</p>');
});