import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AI_MODES,AI_REQUIREMENTS,aiModeFromSettings,buildBackgroundPrompt,backgroundToHtml
} from '../scripts/ai.mjs';

const npc={options:{role:'antagonist',questGiver:true,useAttitude:true,attitude:'hostile',useStatus:true,status:-3,faction:'Green Council'},fields:{
  name:{text:'Melian Thorn',die:100,roll:12},profession:{text:'herbalist',die:20,roll:2},
  flaw:{text:'Cannot keep a secret',die:20,roll:18},scheme:{text:'Hiding a forbidden contract',die:20,roll:5}
}};

test('Only Off and ChatGPT Prompt remain available in settings',()=>{
 assert.deepEqual(Object.keys(AI_MODES),['off','manual']);
 assert.match(AI_MODES.manual,/copy and paste/i);
 assert.match(AI_REQUIREMENTS.manual,/Free.*Go.*Plus.*Pro/);
 assert.match(AI_REQUIREMENTS.manual,/no API key/i);
 assert.equal(aiModeFromSettings('bad'),'off');
 assert.equal(aiModeFromSettings('off'),'off');
 assert.equal(aiModeFromSettings('manual'),'manual');
 assert.equal(aiModeFromSettings('chatgpt'),'manual'); // backward-compatible old settings
 assert.equal(aiModeFromSettings('api'),'manual');
});

test('Prompt includes the edited NPC traits, branching roles and context',()=>{
 const prompt=buildBackgroundPrompt(npc,{length:'extensive',tone:'dark fantasy',context:'Old Margreve'});
 for(const term of ['Melian Thorn','herbalist','Cannot keep a secret','Hiding a forbidden contract','Green Council',
 'antagonist (also a quest giver)','Old Margreve','550–750','Public Demeanor','Adventure Hook']) assert(prompt.includes(term),term);
 assert(!prompt.includes('d100:'));
});

test('AI background HTML is escaped, line breaks maintained, empty input suppressed',()=>{
 const html=backgroundToHtml('First line\n<script>alert(1)</script> & secrets');
 assert(html.includes('NPC Background'));
 assert(html.includes('First line<br>&lt;script&gt;alert(1)&lt;/script&gt; &amp; secrets'));
 assert.equal(backgroundToHtml('  '),'');
});