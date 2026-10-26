import {
  MODULE_ID, VERSION, TABLE_META, DEFAULT_TABLES, DEFAULT_OPTIONS,
  combineTables, normalizeOptions, activeKeys, draw, generateNpc, validateTablePack
} from './data.mjs';
import {AI_REQUIREMENTS, aiModeFromSettings, buildBackgroundPrompt, backgroundToHtml} from './ai.mjs';

const esc = (v='') => String(v).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pretty = s => TABLE_META[s]?.label || s;
const STATUS_OPTIONS = [[-5,'-5 Hostile'],[-3,'-3 Unfriendly'],[-1,'-1 Vexed'],[0,'0 Indifferent'],[1,'+1 Intrigued'],[3,'+3 Friendly'],[5,'+5 Welcoming']];
const ATTITUDES=['friendly','neutral','hostile'];
const DETAIL_KEYS=['name','feature','profession','personality','bond','flaw','want'];

/**
 * Write a generated profile into Black Flag's real NPC Biography field.
 * When using an existing NPC as the statistics template, its biography is
 * preserved above the generated profile. The original template is never changed.
 */
export function addNpcBiography(actorData, generatedHtml) {
  actorData.system ??= {};
  actorData.system.biography ??= {};
  const existing = actorData.system.biography.value;
  if (existing != null && typeof existing !== 'string') {
    throw new TypeError('The NPC template biography is not HTML text.');
  }
  const original = (existing || '').trim();
  actorData.system.biography.value = original
    ? `${original}\n<hr>\n${generatedHtml}`
    : generatedHtml;
  return actorData;
}

/** ApplicationV2 without a Handlebars dependency: returned markup is carefully escaped. */
export class NpcGeneratorApp extends foundry.applications.api.ApplicationV2 {
  static DEFAULT_OPTIONS = {
    id: `${MODULE_ID}-app`,
    classes: [MODULE_ID],
    window: {title:'Black Flag NPC Generator',icon:'fa-solid fa-users',resizable:true},
    position: {width:790,height:690}
  };

  constructor(options={}) {
    super(options);
    this.config={...DEFAULT_OPTIONS,fields:[...DEFAULT_OPTIONS.fields],attitude:'neutral'};
    this.results={};
    this.locked=new Set();
    this.expandedPanels=new Set(); // Preserve optional-panel state across Foundry rerenders.
    this.actorTemplate='';
    this.ai={length:'detailed',tone:'grounded fantasy',context:'',background:'',stale:false};
    this.results=this.#generate();
  }

  #tables() {
    let custom={};
    try {custom=game.settings.get(MODULE_ID,'customTables') || {};}
    catch { /* settings might not be registered yet during initial tests */ }
    return combineTables(custom);
  }

  #generate() {return generateNpc(this.config,this.#tables(),Math.random,this.results,this.locked);}

  #aiMode(){
    try {return aiModeFromSettings(game.settings.get(MODULE_ID,'aiMode'));}
    catch {return 'off';}
  }
  #invalidateBackground(clear=false){
    if(clear){this.ai.background='';this.ai.stale=false;}
    else if(this.ai.background.trim())this.ai.stale=true;
  }


  async _renderHTML() {
    const cfg=normalizeOptions(this.config);
    const aiMode=this.#aiMode();
    const active=new Set(activeKeys(cfg));
    const rows=[cfg.role,...(cfg.questGiver?['questGiver']:[]),...(cfg.role==='antagonist'&&cfg.villainousScheme?['scheme']:[]),...DETAIL_KEYS.filter(k=>active.has(k))];
    const customCount=Object.keys(game.settings.get(MODULE_ID,'customTables') || {}).length;
    const actorOptions=(game.actors?.contents || []).filter(a=>a.type==='npc').sort((a,b)=>a.name.localeCompare(b.name));

    const displayRows=rows.map(key=> {
      const entry=this.results[key];
      const text=entry?.text ?? '';
      const roll=entry ? `d${entry.die}: ${entry.roll}` : 'Not rolled';
      const locked=this.locked.has(key);
      return `<div class="bfng-result">
        <div class="bfng-result-head">
          <label class="bfng-result-label" for="bfng-edit-${key}">${esc(pretty(key))}<span title="Actual table roll">${esc(roll)}</span></label>
          <div class="bfng-result-controls">
            <button type="button" data-action="roll" data-key="${key}" aria-label="Reroll ${esc(pretty(key))}" ${locked?'disabled title="Unlock to reroll"':''}><i class="fa-solid fa-dice"></i> Reroll</button>
            <button type="button" data-action="lock" data-key="${key}" aria-label="${locked?'Unlock':'Lock'} ${esc(pretty(key))}" aria-pressed="${locked}"><i class="fa-solid ${locked?'fa-lock':'fa-lock-open'}"></i> ${locked?'Locked':'Lock'}</button>
          </div>
        </div>
        <textarea id="bfng-edit-${key}" data-field="${key}" rows="2" aria-label="Edit ${esc(pretty(key))}">${esc(text)}</textarea>
      </div>`;
    }).join('');

    return `<section class="bfng-root" aria-label="NPC Generator">
      <div class="bfng-intro"><div><strong>NPC Workshop</strong><small>Original sample tables • local table-pack import • GM only</small></div><button type="button" data-action="generate" class="bfng-primary"><i class="fa-solid fa-dice-d20"></i> Generate NPC</button></div>
      <div class="bfng-layout">
      <aside class="bfng-controls">
        <fieldset><legend>Generation mode</legend>
          <div class="bfng-mode">${['quick','full','custom'].map(m=>`<label><input type="radio" name="mode" value="${m}" ${cfg.mode===m?'checked':''}><span>${m==='quick'?'Quick':m==='full'?'Full':'Custom'}</span></label>`).join('')}</div>
        </fieldset>
        <fieldset><legend>NPC role</legend>
          <label class="bfng-input-label">Base role<select data-option="role">
            ${[['background','Background NPC'],['ally','Ally'],['antagonist','Antagonist']].map(([k,v])=>`<option value="${k}" ${cfg.role===k?'selected':''}>${v}</option>`).join('')}
          </select></label>
          <label class="bfng-check"><input type="checkbox" data-option="questGiver" ${cfg.questGiver?'checked':''}> Also a quest giver</label>
          ${cfg.role==='antagonist'?`<label class="bfng-check"><input type="checkbox" data-option="villainousScheme" ${cfg.villainousScheme?'checked':''}> Include villainous scheme</label>`:''}
        </fieldset>
        <fieldset><legend>Character details</legend>
          ${cfg.mode!=='custom'?`<p class="bfng-hint">${cfg.mode==='quick'?'Quick: name, appearance and personality.':'Full: all seven character details.'}</p>`:''}
          ${cfg.mode==='custom'?`<div class="bfng-check-grid">${DETAIL_KEYS.map(k=>`<label class="bfng-check"><input type="checkbox" data-field-toggle="${k}" ${cfg.fields.includes(k)?'checked':''}> ${esc(pretty(k))}</label>`).join('')}</div>`:''}
        </fieldset>
        <details class="bfng-panel" data-panel="social" ${this.expandedPanels.has('social')?'open':''}><summary>Social options${cfg.useAttitude||cfg.useStatus?' • Active':''}</summary><div class="bfng-panel-content">
          <label class="bfng-check"><input type="checkbox" data-option="useAttitude" ${cfg.useAttitude?'checked':''}> Track attitude</label>
          ${cfg.useAttitude?`<label class="bfng-input-label">Starting attitude<select data-option="attitude">${ATTITUDES.map(k=>`<option value="${k}" ${cfg.attitude===k?'selected':''}>${k[0].toUpperCase()+k.slice(1)}</option>`).join('')}</select></label>`:''}
          <label class="bfng-check"><input type="checkbox" data-option="useStatus" ${cfg.useStatus?'checked':''}> Track faction status</label>
          ${cfg.useStatus?`<label class="bfng-input-label">Status<select data-option="status">${STATUS_OPTIONS.map(([v,s])=>`<option value="${v}" ${Number(cfg.status)===v?'selected':''}>${s}</option>`).join('')}</select></label><label class="bfng-input-label">Faction<input type="text" maxlength="100" data-free="faction" placeholder="Faction name" value="${esc(this.config.faction||'')}"></label>`:''}
        </div></details>
        <details class="bfng-panel" data-panel="tables" ${this.expandedPanels.has('tables')?'open':''}><summary>Table packs${customCount?` • ${customCount} customized`:''}</summary><div class="bfng-panel-content">
          <p class="bfng-hint">${customCount} customized table${customCount===1?'':'s'} active. Import a locally prepared JSON pack; imported entries override the samples.</p>
          <div class="bfng-small-actions">
            <button type="button" data-action="import">Import JSON</button><button type="button" data-action="schema">JSON template</button><button type="button" data-action="reset">Reset tables</button>
          </div>
          <input id="bfng-file" type="file" accept=".json,application/json" hidden>
        </div></details>
      </aside>
      <div class="bfng-output">
        <div class="bfng-output-head"><div><strong>Generated NPC</strong><small>Lock any field to preserve it during full rerolls; edit text freely.</small></div><span>${rows.length} rolled fields</span></div>
        ${displayRows}
        ${aiMode!=='off'?`<details class="bfng-panel bfng-ai" data-panel="ai" ${this.expandedPanels.has('ai')?'open':''}><summary>ChatGPT Background${this.ai.background.trim()?' • Draft ready':''}</summary><div class="bfng-panel-content">
          <p class="bfng-hint bfng-ai-notice">${esc(AI_REQUIREMENTS[aiMode])}</p>
          <div class="bfng-ai-controls">
            <label class="bfng-input-label">Length<select data-ai="length">${[['brief','Brief (120–180 words)'],['detailed','Detailed (260–400 words)'],['extensive','Extensive (550–750 words)']].map(([v,l])=>`<option value="${v}" ${this.ai.length===v?'selected':''}>${l}</option>`).join('')}</select></label>
            <label class="bfng-input-label">Tone<select data-ai="tone">${['grounded fantasy','dark fantasy','heroic fantasy','comedic'].map(v=>`<option value="${v}" ${this.ai.tone===v?'selected':''}>${v}</option>`).join('')}</select></label>
          </div>
          <label class="bfng-input-label">Campaign context (optional)<textarea data-ai="context" rows="3" maxlength="1200" placeholder="Region, mood, local factions, existing lore…">${esc(this.ai.context)}</textarea></label>
          <div class="bfng-export-buttons">
            <button type="button" data-action="copy-ai"><i class="fa-solid fa-copy"></i> Copy ChatGPT prompt</button>
            <button type="button" data-action="open-ai"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open ChatGPT</button>
          </div>
          <details class="bfng-ai-prompt"><summary>View generated prompt / copy manually</summary><textarea rows="7" readonly aria-label="NPC background prompt">${esc(this.#prompt())}</textarea></details>
          <label class="bfng-input-label">Background (paste or edit)<textarea data-ai="background" rows="9" maxlength="15000" placeholder="Paste ChatGPT's response here.">${esc(this.ai.background)}</textarea></label>
          ${this.ai.stale?`<p class="bfng-ai-warning"><i class="fa-solid fa-triangle-exclamation"></i> NPC details changed since this background was written. Review the text before saving.</p>`:''}
          <p class="bfng-hint">The background is appended to the Actor Biography and Journal. ChatGPT is only accessed when you choose to copy the prompt and open its website; no information is sent automatically.</p>
        </div></details>`:''}
        <fieldset class="bfng-export"><legend>Save to Foundry</legend>
          <label class="bfng-input-label">Actor statistics (optional)<select data-free="actorTemplate">
            <option value="">New blank Black Flag NPC</option>
            ${actorOptions.map(a=>`<option value="${esc(a.uuid)}" ${this.actorTemplate===a.uuid?'selected':''}>Copy: ${esc(a.name)}</option>`).join('')}
          </select></label>
          <p class="bfng-hint">Saving an Actor without a template uses the game system's default NPC statistics. Copy an existing NPC for combat-ready stats.</p>
          <div class="bfng-export-buttons"><button type="button" data-action="journal"><i class="fa-solid fa-book"></i> Save Journal</button><button type="button" data-action="actor" class="bfng-primary"><i class="fa-solid fa-user-plus"></i> Create NPC Actor</button></div>
        </fieldset>
      </div></div>
      <footer class="bfng-footer">${VERSION} testing build. Tables and text here are original examples, not the Game Master's Guide table text.</footer>
    </section>`;
  }

  _replaceHTML(result,content){
    // Avoid jumping to the top when the GM rerolls a field farther down the list.
    const previousScroll=content.scrollTop;
    content.innerHTML=result;
    content.scrollTop=previousScroll;
  }

  _onRender(context,options){
    super._onRender(context,options);
    const root=this.element.querySelector('.bfng-root');
    // Native details/summary panels remain keyboard accessible and survive rerenders.
    root?.querySelectorAll?.('details[data-panel]').forEach(panel=>{
      panel.addEventListener('toggle',()=>{
        if(panel.open)this.expandedPanels.add(panel.dataset.panel);
        else this.expandedPanels.delete(panel.dataset.panel);
      });
    });
    root?.addEventListener('click',e=>this.#click(e));
    root?.addEventListener('change',e=>this.#change(e));
    root?.addEventListener('input',e=>{
      const t=e.target;
      if(t.matches('textarea[data-field]') && this.results[t.dataset.field]) {this.results[t.dataset.field].text=t.value;this.#invalidateBackground();}
      if(t.matches('[data-free="faction"]')) {this.config.faction=t.value;this.#invalidateBackground();}
      if(t.dataset.ai==='background'){this.ai.background=t.value;this.ai.stale=false;}
      if(t.dataset.ai==='context')this.ai.context=t.value;
    });
  }

  async #change(e){
    const t=e.target;
    if(t.id==='bfng-file') return this.#importFile(t);
    if(t.dataset.ai){
      if(['length','tone','context','background'].includes(t.dataset.ai))this.ai[t.dataset.ai]=t.value;
      return;
    }
    if(t.name==='mode') this.config.mode=t.value;
    if(t.hasAttribute('data-option')) {
      const key=t.dataset.option;
      this.config[key]=t.type==='checkbox'?t.checked:key==='status'?Number(t.value):t.value;
    }
    if(t.hasAttribute('data-field-toggle')) {
      const key=t.dataset.fieldToggle;
      this.config.fields=t.checked?[...new Set([...this.config.fields,key])]:this.config.fields.filter(f=>f!==key);
    }
    if(t.dataset.free==='actorTemplate'){this.actorTemplate=t.value;return;}
    if(t.dataset.free==='faction'){this.config.faction=t.value;this.#invalidateBackground();return;}
    if(t.matches('textarea[data-field]')) {
      const key=t.dataset.field;
      if(this.results[key]) this.results[key].text=t.value;
      return;
    }
    this.#invalidateBackground();
    this.results=this.#generate();
    await this.render();
  }

  async #click(e){
    const button=e.target.closest('button[data-action]');
    if(!button || button.disabled) return;
    e.preventDefault();
    const action=button.dataset.action;
    const key=button.dataset.key;
    if(action==='generate') {this.#invalidateBackground(true);this.results=this.#generate();return this.render();}
    if(action==='roll') {
      if(!this.locked.has(key)){this.results[key]=draw(key,this.#tables());this.#invalidateBackground();}
      return this.render();
    }
    if(action==='lock') {
      if(this.locked.has(key))this.locked.delete(key);else this.locked.add(key);
      return this.render();
    }
    if(action==='copy-ai') return this.#copyPrompt();
    if(action==='open-ai') {window.open('https://chatgpt.com/','_blank','noopener,noreferrer');return;}
    if(action==='import') {this.element.querySelector('#bfng-file')?.click();return;}
    if(action==='schema') return this.#exportSchema();
    if(action==='reset') return this.#resetTables();
    if(action==='journal') return this.#save('journal');
    if(action==='actor') return this.#save('actor');
  }

  async #importFile(input){
    const file=input.files?.[0];
    if(!file) return;
    if(file.size>1_000_000) {ui.notifications.error('Table pack exceeds 1 MB.');return;}
    try {
      const text=await file.text();
      const incoming=validateTablePack(JSON.parse(text));
      const previous=game.settings.get(MODULE_ID,'customTables')||{};
      await game.settings.set(MODULE_ID,'customTables',{...previous,...incoming});
      ui.notifications.info(`Imported ${Object.keys(incoming).length} NPC tables.`);
      this.#invalidateBackground();
      this.results=this.#generate();
      await this.render();
    }catch(err){console.error(`${MODULE_ID} | import failed`,err);ui.notifications.error(`NPC table import: ${err.message}`);}
    finally{input.value='';}
  }

  #exportSchema(){
    const example={_help:'Replace strings with your own local table data. Each table must have d20 or d100 entries as appropriate. Delete any tables you are not customizing.',tables:{
      ally:DEFAULT_TABLES.ally,
      name:DEFAULT_TABLES.name
    }};
    const blob=new Blob([JSON.stringify(example,null,2)],{type:'application/json'});
    const href=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=href;a.download='npc-generator-table-pack-example.json';a.click();
    setTimeout(()=>URL.revokeObjectURL(href),1000);
  }

  async #resetTables(){
    const ok=await foundry.applications.api.DialogV2.confirm({window:{title:'Reset NPC tables'},content:'<p>Remove all imported overrides and restore the bundled original sample tables?</p>',rejectClose:false});
    if(!ok)return;
    await game.settings.set(MODULE_ID,'customTables',{});
    this.#invalidateBackground();
    this.results=this.#generate();
    await this.render();
    ui.notifications.info('NPC table overrides removed.');
  }

  #prompt(){return buildBackgroundPrompt(this.#record(),{length:this.ai.length,tone:this.ai.tone,context:this.ai.context});}

  async #copyPrompt(){
    try {
      const prompt=this.#prompt();
      if(navigator.clipboard?.writeText){
        try{await navigator.clipboard.writeText(prompt);}
        catch{if(foundry.utils.copyPlainText) await foundry.utils.copyPlainText(prompt);
          else throw new Error('Clipboard permission denied; expand View generated prompt to copy manually.');}
      }else if(foundry.utils.copyPlainText) await foundry.utils.copyPlainText(prompt);
      else throw new Error('Clipboard permission is unavailable; expand View generated prompt to copy manually.');
      ui.notifications.info('NPC background prompt copied. Paste it into ChatGPT; paste the response into the Background field.');
    }catch(err){ui.notifications.error(`Could not copy prompt: ${err.message}`);}
  }

  #record(){
    const cfg=normalizeOptions(this.config);
    const keys=activeKeys(cfg);
    const record={moduleVersion:VERSION,system:'black-flag',options:{...cfg, faction:this.config.faction||''},fields:Object.fromEntries(keys.filter(k=>this.results[k]).map(k=>[k,{...this.results[k]}]))};
    if(this.#aiMode()!=='off'&&this.ai.background.trim())record.aiBackground={text:this.ai.background.trim().slice(0,15000),method:this.#aiMode(),stale:this.ai.stale};
    return record;
  }

  #toHtml(record){
    const sections=Object.entries(record.fields).map(([key,v])=>`<p><strong>${esc(pretty(key))}:</strong> ${esc(v.text)} <small>(d${v.die}: ${v.roll})</small></p>`).join('');
    const meta=[];
    if(record.options.useAttitude)meta.push(`<p><strong>Attitude:</strong> ${esc(record.options.attitude)}</p>`);
    if(record.options.useStatus)meta.push(`<p><strong>Faction status:</strong> ${esc(record.options.faction||'Unnamed faction')} — ${record.options.status}</p>`);
    const background=record.aiBackground?.text?backgroundToHtml(record.aiBackground.text):'';
    return `<h2>NPC overview</h2><p><strong>Role:</strong> ${esc(record.options.role)}${record.options.questGiver?' (also a quest giver)':''}</p>${sections}${meta.join('')}${background}<hr><p><em>Created by Black Flag NPC Generator. Editable GM notes; no combat statistics are assumed.</em></p>`;
  }

  async #save(kind){
    if(!game.user?.isGM){ui.notifications.error('Only GMs may create generated NPC documents.');return;}
    const record=this.#record();
    const name=record.fields.name?.text || `Generated ${record.options.role}`;
    const flags={[MODULE_ID]:{generated:record,createdAt:new Date().toISOString()}};
    try {
      if(kind==='journal') {
        const journal=await JournalEntry.create({name,flags,pages:[{name:'NPC Profile',type:'text',text:{content:this.#toHtml(record),format:1}}]});
        ui.notifications.info(`Saved NPC journal: ${name}`);
        journal?.sheet?.render(true);
      }else{
        let source=null;
        if(this.actorTemplate){ source=await fromUuid(this.actorTemplate); }
        if(source && (source.documentName!=='Actor' || source.type!=='npc')) throw new Error('Selected statistics template is not an NPC Actor.');
        const data=source?foundry.utils.deepClone(source.toObject()):{type:'npc'};
        delete data._id; delete data._stats;delete data.folder;delete data.sort;
        data.name=name;
        data.type='npc';
        if(data.prototypeToken) data.prototypeToken.name=name;
        data.flags={...(data.flags||{}),...flags};
        addNpcBiography(data,this.#toHtml(record));
        const actor=await Actor.create(data);
        if(!actor) throw new Error('Foundry did not create the NPC Actor.');
        ui.notifications.info(`Created NPC Actor: ${name}`);
        actor.sheet?.render(true);
      }
    }catch(err){console.error(`${MODULE_ID} | save failed`,err);ui.notifications.error(`Unable to save NPC: ${err.message}`);}
  }
}