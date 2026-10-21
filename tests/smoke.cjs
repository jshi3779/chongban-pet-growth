const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.BASE_URL||'http://localhost:4173/');
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('petgrowth.v1')));
 const tab=async t=>page.locator('.sd-tabbar [data-tab="'+t+'"]').click();
 const save=async()=>page.getByRole('button',{name:'保存',exact:true}).click();
 await page.locator('[data-add="weight"]').first().click();await page.locator('[name="value"]').fill('5.25');await save();
 assert.equal((await state()).records.at(-1).value,5.25);await page.reload();assert.equal((await state()).records.at(-1).value,5.25);
 await page.locator('#quick-weight').fill('昨天体重9.6斤');await page.getByRole('button',{name:'识别并核对'}).click();
 assert.equal(await page.locator('[name="value"]').inputValue(),'4.8');await save();
 await page.locator('#quick-weight').fill('今天疫苗');await page.getByRole('button',{name:'识别并核对'}).click();assert.match(await page.getByRole('alert').innerText(),/请按/);
 const download=page.waitForEvent('download');await page.locator('[data-act="export-health"]').click();const file=await download;assert.match(file.suggestedFilename(),/照护档案.txt/);
 const chunks=[];for await(const chunk of await file.createReadStream())chunks.push(chunk);assert.match(Buffer.concat(chunks).toString('utf8'),/年糕 · 照护档案/);
 await page.locator('summary').filter({hasText:'宠伴 Plus'}).click();await page.getByRole('button',{name:'我感兴趣',exact:true}).click();await page.reload();assert.equal((await state()).memberInterest,true);
 await tab('community');await page.locator('[data-comm="nearby"]').click();
 await page.locator('[name="city"]').fill('上海');await page.locator('[name="district"]').fill('徐汇');await page.getByRole('button',{name:'保存地区'}).click();assert.equal(await page.locator('[data-post]').count(),2);
 await page.getByRole('button',{name:'猫',exact:true}).click();assert.equal(await page.locator('[data-post]').count(),1);
 await page.getByRole('button',{name:'全部',exact:true}).click();
 await page.locator('[data-act="newpost"]').click();await page.locator('[name="title"]').fill('同城成长测试');await page.locator('[name="body"]').fill('今天的一点小进步');await page.locator('[name="nearby"]').check();await save();
 assert.equal((await state()).posts[0].city,'上海');assert.equal((await state()).posts[0].km,undefined);
 await page.reload();assert.match(await page.locator('#view').innerText(),/同城成长测试/);assert.match(await page.locator('#view').innerText(),/仅存本机/);
 await page.locator('[data-like]').first().click();assert.equal((await state()).posts[0].likes,1);
 await page.getByRole('button',{name:'地区：上海 徐汇'}).click();await page.locator('[name="city"]').fill('北京');await page.getByRole('button',{name:'保存地区'}).click();assert.equal(await page.locator('[data-post]').count(),0);
 await tab('home');await page.locator('[data-act="addpet"]').click();await page.locator('[name="name"]').fill('测试狗狗');await page.locator('[name="type"]').selectOption('狗');await save();assert.match(await page.locator('.pethead h2').innerText(),/测试狗狗/);
 assert.match(await page.locator('.companion').first().innerText(),/还没有体重记录/);
 await page.locator('[data-pet="p1"]').click();
 await tab('calendar');assert.equal(await page.locator('.wd').count(),7);await page.locator('[data-calnav="1"]').click();
 await page.locator('.wd').first().click();await tab('timeline');await page.locator('[data-filter="weight"]').click();assert.equal(await page.locator('.ev').count(),7);
 const before=(await state()).records.length;page.once('dialog',d=>d.accept());await page.locator('[data-del]').first().click();assert.equal((await state()).records.length,before-1);
 await tab('calendar');await page.locator('[data-add="vaccine"]').first().click();await page.locator('[name="name"]').fill('测试疫苗');await save();assert.equal((await state()).records.at(-1).name,'测试疫苗');
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const t of ['home','calendar','timeline','community']){await tab(t);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width+' '+t);}
 }
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: editable quick entry, persistence, export, membership interest, regional filtering/publishing, likes, pet switching, original calendar/timeline/delete, 4 widths, no runtime errors');
})().catch(e=>{console.error(e);process.exit(1)});
