import test from 'node:test';
import assert from 'node:assert/strict';

let init;
let ready;
const registries=new Map();
const values=new Map();
globalThis.foundry={applications:{api:{ApplicationV2:class {}}}};
globalThis.Hooks={once:(event,fn)=>{if(event==='init')init=fn;if(event==='ready')ready=fn;},on:()=>{}};
globalThis.ui={notifications:{info:()=>{}}};
globalThis.game={
 user:{isGM:true},
 settings:{register:(module,key,definition)=>registries.set(key,definition),registerMenu:()=>{},get:(module,key)=>values.get(key),set:async(module,key,value)=>values.set(key,value)},
 modules:{get:()=>({})}
};
await import('../scripts/main.mjs');

test('Foundry Game Settings offers Off and ChatGPT Prompt, without API controls',()=>{
 init();
 const setting=registries.get('aiMode');
 assert(setting);
 assert.equal(setting.default,'off');
 assert.equal(setting.scope,'world');
 assert.equal(setting.config,true);
 assert.equal(setting.restricted,true);
 assert.deepEqual(Object.keys(setting.choices),['off','manual']);
 assert.match(setting.hint,/Free, Go, Plus, or Pro/);
 assert.match(setting.hint,/no API key/i);
 assert(!registries.has('aiBridgePort'));
});

test('Legacy ChatGPT plan and API selections migrate to manual prompt only',async()=>{
 values.set('aiMode','api');
 await ready();
 assert.equal(values.get('aiMode'),'manual');
 values.set('aiMode','chatgpt');
 await ready();
 assert.equal(values.get('aiMode'),'manual');
 values.set('aiMode','off');
 await ready();
 assert.equal(values.get('aiMode'),'off');
});