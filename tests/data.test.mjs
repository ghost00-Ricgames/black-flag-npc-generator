import test from 'node:test';
import assert from 'node:assert/strict';
import {
 TABLE_META,DEFAULT_TABLES,activeKeys,normalizeOptions,draw,generateNpc,validateTablePack,combineTables
} from '../scripts/data.mjs';

test('every bundled table has exactly its die-sized number of non-empty entries',()=>{
  for(const [key,meta] of Object.entries(TABLE_META)){
    assert.equal(DEFAULT_TABLES[key].length,meta.die,key);
    assert.equal(new Set(DEFAULT_TABLES[key]).size,meta.die,`uniqueness: ${key}`);
    assert(DEFAULT_TABLES[key].every(s=>typeof s==='string'&&s.length>0),key);
  }
});
test('quest giver is an overlay; scheme only applies to an antagonist',()=>{
  const ally=activeKeys({role:'ally',questGiver:true,villainousScheme:true,mode:'quick'});
  assert(ally.includes('ally')&&ally.includes('questGiver'));
  assert(!ally.includes('scheme'));
  const ant=activeKeys({role:'antagonist',questGiver:true,villainousScheme:true,mode:'full'});
  assert(ant.includes('antagonist')&&ant.includes('questGiver')&&ant.includes('scheme'));
});
test('quick, full, custom modes return expected fields',()=>{
  assert(!activeKeys({mode:'quick'}).includes('want'));
  assert(activeKeys({mode:'full'}).includes('want'));
  assert.deepEqual(activeKeys({mode:'custom',fields:['flaw','flaw','name','not-a-field']}),['background','flaw','name']);
});
test('all draw boundaries follow 1-indexed dice',()=>{
  assert.equal(draw('ally',DEFAULT_TABLES,()=>0).roll,1);
  assert.equal(draw('ally',DEFAULT_TABLES,()=>.999999).roll,20);
  assert.equal(draw('name',DEFAULT_TABLES,()=>1).roll,100);
  assert.equal(draw('name',DEFAULT_TABLES,()=>.5).roll,51);
});
test('full generation returns every relevant key and original text',()=>{
  const npc=generateNpc({role:'antagonist',questGiver:true,villainousScheme:true,mode:'full'},DEFAULT_TABLES,()=>0);
  assert.equal(Object.keys(npc).length,10);
  assert.equal(npc.scheme.text,DEFAULT_TABLES.scheme[0]);
});
test('lock preserves modified value across full regeneration',()=>{
  const old=generateNpc({mode:'quick'},DEFAULT_TABLES,()=>0);
  old.name.text='Edited Name';
  const newer=generateNpc({mode:'quick'},DEFAULT_TABLES,()=>0.9,old,['name']);
  assert.equal(newer.name.text,'Edited Name');
  assert.notEqual(newer.feature.text,old.feature.text);
});
test('table overrides validate size, entry type, and unknown keys',()=>{
  const original=DEFAULT_TABLES.flaw.map(s=>s+' test');
  const overridden=validateTablePack({tables:{flaw:original}});
  const tables=combineTables(overridden);
  assert.equal(tables.flaw[0],original[0]);
  assert.equal(tables.name[0],DEFAULT_TABLES.name[0]);
  assert.throws(()=>validateTablePack({want:['one']}),/20 entries/);
  assert.throws(()=>validateTablePack({unknown:['x']}),/Unknown table/);
  assert.throws(()=>validateTablePack({flaw:Array(20).fill('')}),/invalid entry/);
  assert.throws(()=>validateTablePack({tables:{}}),/at least one/);
});
test('normalizeOptions is defensive',()=>{
  const options=normalizeOptions({role:'made-up',mode:'bad',fields:['name','name',23],status:999});
  assert.equal(options.role,'background');assert.equal(options.mode,'full');
  assert.deepEqual(options.fields,['name']);assert.equal(options.status,5);
});