import {MODULE_ID,DEFAULT_TABLES,generateNpc,combineTables,validateTablePack} from './data.mjs';
import {NpcGeneratorApp} from './generator.mjs';
import {AI_MODES, AI_REQUIREMENTS} from './ai.mjs';

let singleton=null;
function openGenerator(){
  if(!game.user?.isGM){ui.notifications.warn('Black Flag NPC Generator is available to GMs only.');return null;}
  if(!singleton) singleton=new NpcGeneratorApp();
  singleton.render(true);
  return singleton;
}

function addActorsButton(app, html){
  if(!game.user?.isGM)return;
  const root=html instanceof HTMLElement?html:html?.[0] ?? app?.element;
  if(!(root instanceof HTMLElement)) return;
  if(root.querySelector('[data-bfng-open]'))return;
  const header=root.querySelector('.directory-header .header-actions, .directory-header .action-buttons, .directory-header');
  if(!header)return;
  const button=document.createElement('button');
  button.type='button';button.className='bfng-launch';
  button.dataset.bfngOpen='';
  button.title='Open NPC Generator';
  button.innerHTML='<i class="fa-solid fa-dice-d20"></i> NPC Generator';
  button.addEventListener('click',openGenerator);
  header.append(button);
}

Hooks.once('init',()=>{
  game.settings.register(MODULE_ID,'aiMode',{
    name:'NPC Backgrounds — ChatGPT Prompt',
    hint:'Off: generate NPCs with the built-in tables only. ChatGPT Prompt: copy the prepared NPC prompt to ChatGPT and paste its response back into Foundry. ChatGPT Free, Go, Plus, or Pro works; no API key or paid API account is needed. No automatic generation or account sign-in.',
    scope:'world',config:true,restricted:true,type:String,choices:AI_MODES,default:'off',
    onChange:()=>{/* New and reopened generator windows read the active mode. */}
  });
  game.settings.register(MODULE_ID,'customTables',{
    name:'Imported NPC Table Overrides',hint:'Custom table entries loaded privately by the GM; world-scoped.',
    scope:'world',config:false,restricted:true,type:Object,default:{}
  });
  game.settings.registerMenu(MODULE_ID,'openGenerator',{
    name:'Open NPC Generator',label:'Open NPC Generator',hint:'Generate and save NPCs using the original sample tables or your local table pack.',
    icon:'fa-solid fa-dice-d20',type:NpcGeneratorApp,restricted:true
  });
  const module=game.modules.get(MODULE_ID);
  if(module) module.api={
    open:openGenerator,
    generate:(options={})=>generateNpc(options,combineTables(game.settings.get(MODULE_ID,'customTables'))),
    validateTablePack,
    defaults:DEFAULT_TABLES,
    aiRequirements:AI_REQUIREMENTS
  };
});

Hooks.on('renderActorDirectory',addActorsButton);

// Migrate settings from v0.2.0; discontinued provider selections become prompt-only.
Hooks.once('ready', async () => {
  if (!game.user?.isGM) return;
  try {
    const current=game.settings.get(MODULE_ID,'aiMode');
    if (current==='chatgpt' || current==='api') {
      await game.settings.set(MODULE_ID,'aiMode','manual');
      ui.notifications.info('NPC Generator: AI backgrounds now use the ChatGPT copy-and-paste prompt only.');
    }
  } catch(err) {
    console.warn(`${MODULE_ID} | Could not migrate AI background setting`,err);
  }
});