const { chromium } = require('playwright');
const path = require('path');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.BASE_URL||'http://localhost:4173/');
 await page.evaluate(()=>document.fonts.ready);

 await page.locator('[data-add="weight"]').first().click();
 await page.locator('[name="value"]').fill('5.25');
 await page.getByRole('button',{name:'保存',exact:true}).click();
 assert.match(await page.locator('.profile .stats').innerText(),/5.25/);
 await page.reload();assert.match(await page.locator('.profile .stats').innerText(),/5.25/);
 await page.locator('.top-calendar').click();
 assert.equal(await page.locator('.day').count(),new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate());
 const monthLabel=await page.locator('.calhead').innerText();await page.locator('[data-calnav="1"]').click();assert.notEqual(await page.locator('.calhead').innerText(),monthLabel);
 await page.locator('[data-calnav="-1"]').click();

 await page.locator('.sd-tabbar [data-tab="timeline"]').click();
 await page.locator('[data-filter="weight"]').click();assert.equal(await page.locator('.tl .it').count(),6);
 await page.locator('.sd-tabbar [data-tab="community"]').click();

 await page.locator('[data-seg="share"]').click();assert.match(await page.locator('.coming').innerText(),/养宠广场/);
 await page.locator('.top [data-act="addpet"]').click();await page.locator('[name="name"]').fill('测试狗狗');await page.locator('[name="type"]').selectOption('狗');await page.getByRole('button',{name:'保存',exact:true}).click();
 await page.locator('.sd-tabbar [data-tab="home"]').click();assert.match(await page.locator('.profile h2').innerText(),/测试狗狗/);
 assert.match(await page.locator('.hero img').getAttribute('src'),/dog/);
 await page.locator('[data-pet="p1"]').click();
 const beforeDelete=await page.evaluate(()=>JSON.parse(localStorage.getItem('petgrowth.v1')).records.length);
 page.once('dialog',d=>d.accept());await page.locator('[data-del]').first().click();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('petgrowth.v1')).records.length),beforeDelete-1);
 await page.locator('.top-calendar').click();
 await page.locator('.day.today').click();await page.locator('[data-add="milestone"]').click();await page.locator('[name="name"]').fill('测试成长瞬间');await page.getByRole('button',{name:'保存',exact:true}).click();
 assert.match(await page.locator('#view').innerText(),/测试成长瞬间/);
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const tab of ['home','calendar','timeline','community']){
   if(tab==='calendar')await page.locator('.top-calendar').click();else{if(await page.locator('.top-calendar.on').count())await page.locator('.top-calendar').click();await page.locator('.sd-tabbar [data-tab="'+tab+'"]').click();}
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width+' '+tab);
   await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
   assert(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)),'image missing');
  }
 }
 await page.evaluate(()=>localStorage.clear());await page.reload();await page.setViewportSize({width:1440,height:1000});

 assert.deepEqual(errors,[]);console.log('PASS: record create / persist / delete, pet switching, calendar month and check-in, timeline filter, community tabs, images, 4 responsive widths, no JS errors');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

