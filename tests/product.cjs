const fs=require('node:fs');
const ts=require('typescript');
const assert=require('node:assert/strict');
// Execute the production pure TypeScript helpers without adding a test runtime dependency.
require.extensions['.ts']=(m,file)=>m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,file);
const {parseWeight,nearbyPosts,careSummary,healthText,healthActivity}=require('../src/product.ts');
const {seed,load,KEY}=require('../src/utils.ts');
assert.deepEqual(parseWeight('今天体重4.8kg','2026-10-21'),{date:'2026-10-21',value:'4.8'});
assert.deepEqual(parseWeight('昨天称重9.6斤','2026-10-21'),{date:'2026-10-20',value:'4.8'});
assert.deepEqual(parseWeight('2026-10-01体重4.25公斤','2026-10-21'),{date:'2026-10-01',value:'4.25'});
for(const input of ['体重0kg','体重-3kg','今天体重4kg昨天5kg','2026-02-30体重4kg','2026-10-22体重4kg','今天疫苗三联','体重4.8','体重3或4kg'])assert.equal(parseWeight(input,'2026-10-21'),null,input);
const s=seed();const p=s.pets[0];
s.pets.push({id:'other',name:'其他宠物',type:'狗'});s.records.push({id:999,petId:'other',kind:'weight',date:'2026-10-21',value:90});
assert(!healthText(s,p).includes('90kg'));assert(healthText(s,p).includes('照护档案'));assert.equal(careSummary(s,p).weights.length,5);
assert.equal(nearbyPosts(s.posts,'上海市','徐汇','猫').length,1);
assert.equal(nearbyPosts(s.posts,'上海','徐汇区','猫').length,1);
assert.equal(nearbyPosts(s.posts,'上海','','狗').length,3);
assert.equal(nearbyPosts(s.posts,'北京','','全部').length,0);
assert.equal(nearbyPosts(s.posts,'','','全部').length,0);
const old={...s,region:undefined,memberInterest:undefined,posts:[{id:101,author:'a',pet:'b',title:'c',body:'',shape:'a',likes:0,liked:false,km:.8,place:'徐汇'},{id:900,mine:true,author:'我',pet:'b',title:'c',body:'',shape:'a',likes:0,liked:false,km:.1,place:'我的位置'}]};
global.localStorage={getItem:key=>key===KEY?JSON.stringify(old):null};
const migrated=load();assert.deepEqual(migrated.region,{city:'',district:''});assert.equal(migrated.posts[0].city,'上海');assert.equal(migrated.posts[0].km,undefined);assert.equal(migrated.posts[1].city,undefined);assert.equal(migrated.posts[1].km,undefined);assert.equal(migrated.records.length,s.records.length);
console.log('PASS: structured weight parser, ambiguity/date rejection, region/type matching, report pet isolation, legacy state migration');

const heatState={...seed(),records:[{id:1,petId:'p1',kind:'vaccine',date:'2023-12-01',next:'2024-01-01'},{id:2,petId:'p1',kind:'deworm',date:'2023-12-01'},{id:3,petId:'p1',kind:'weight',date:'2024-01-01',value:4},{id:4,petId:'other',kind:'vaccine',date:'2023-12-01'},{id:5,petId:'p1',kind:'vaccine',date:'2024-02-20'}]};
const activity=healthActivity(heatState,'p1',2024,1,'2024-02-15');
assert.equal(activity.start,'2023-12-01');assert.equal(activity.end,'2024-02-29');assert.equal(activity.cells.filter(Boolean).length,91);assert.equal(activity.cells.length%7,0);assert.equal(activity.cells[4],'2023-12-01');assert.equal(new Set(activity.cells.filter(Boolean)).size,91);assert.equal(activity.counts['2023-12-01'],2);assert.equal(activity.total,2);assert.equal(activity.counts['2024-01-01'],undefined);assert.deepEqual(activity.months.map(m=>m.month),[12,1,2]);console.log('PASS: three-month activity leap year, cross-year, grid alignment, pet/type isolation, future/due dates not counted');
