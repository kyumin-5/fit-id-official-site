'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ROOT=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const css=fs.readFileSync(path.join(ROOT,'styles.css'),'utf8');
const js=fs.readFileSync(path.join(ROOT,'app.js'),'utf8');
const vercel=JSON.parse(fs.readFileSync(path.join(ROOT,'vercel.json'),'utf8'));

test('all referenced local assets exist in GitHub repository',()=>{
  const localPaths=[...html.matchAll(/(?:src|href)=["'](\.\/[^"'?#]+)(?:[?#][^"']*)?["']/g)].map(m=>m[1]);
  assert.ok(localPaths.length>=5,'expected CSS, script, favicon and image assets');
  for(const localPath of localPaths){
    const absolute=path.resolve(ROOT,localPath);
    assert.ok(absolute.startsWith(ROOT+path.sep),'do not allow path traversal');
    assert.ok(fs.existsSync(absolute),`Missing site asset: ${localPath}`);
  }
});
test('navigation hash links reference IDs that exist',()=>{
  const ids=new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]));
  const anchors=[...html.matchAll(/\bhref=["']#([^"']+)["']/g)].map(m=>m[1]);
  assert.ok(anchors.length>=7);
  for(const anchor of anchors)assert.ok(ids.has(anchor),`Broken local anchor #${anchor}`);
});
test('external services and official contact channels remain linked',()=>{
  for(const expected of [
    'fit-id-consumer-mtvz.vercel.app','fit-id-partner2.vercel.app',
    'fit-id-demo-malls.vercel.app','mailto:ben-12@naver.com',
    'https://pf.kakao.com/_LXiFX'
  ])assert.ok(html.includes(expected),`Missing official link: ${expected}`);
});
test('visual fitting introduction uses optimized real images and retains accurate caveat',()=>{
  const section=html.match(/<section class="virtual-tryon-section"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section,'virtual try-on landing section must exist');
  for(const asset of [
    'virtual-tryon-showcase.webp',
    'virtual-tryon-style-model.webp',
    'virtual-tryon-style-products.webp'
  ])assert.ok(section.includes(asset),`Missing virtual try-on visual: ${asset}`);
  assert.match(section,/사이즈별 가상 착장/);
  assert.match(section,/시뮬레이션/);
  assert.match(section,/fit-id-consumer-mtvz\.vercel\.app/);
  const imgs=[...section.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]);
  assert.ok(imgs.length>=3);
  for(const img of imgs)assert.match(img,/\balt=["'][^"']+["']/);
});
test('PoC flow keeps human-approved contact transfer; no fake auto-submission',()=>{
  assert.match(html,/EARLY PARTNER PROCESS/);
  assert.match(html,/PoC 제휴 문의서 만들기/);
  assert.match(html,/자동 전송되지는 않습니다/);
  for(const id of ['inquiry-form','shop-name','person-name','contact-way','inquiry-output','copy-again'])
    assert.ok(html.includes(`id="${id}"`),`Missing form control: ${id}`);
  assert.match(js,/inquiryForm\.addEventListener\('submit'/);
  assert.match(js,/mailto:ben-12@naver\.com/);
});
test('security and baseline accessibility metadata remain present',()=>{
  const headers=vercel.headers?.flatMap(item=>item.headers||[])||[];
  for(const key of ['X-Content-Type-Options','Referrer-Policy','X-Frame-Options','Permissions-Policy'])
    assert.ok(headers.some(item=>item.key===key),`Missing security header ${key}`);
  for(const attr of ['lang="ko"','<meta name="viewport"','<title>','class="skip-link"'])
    assert.ok(html.includes(attr),`Missing accessibility or SEO metadata: ${attr}`);
  assert.ok(css.includes('@media'),'responsive rules must be present');
});
