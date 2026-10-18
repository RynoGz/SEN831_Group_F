import {test,expect} from '@playwright/test';

async function login(page,name){
 await page.goto('/auth/login');
 await page.getByLabel('Email',{exact:true}).fill(`${name}@example.test`);
 await page.getByLabel('Password',{exact:true}).fill('Fictional-test-password-1!');
 await page.getByRole('button',{name:'Sign in',exact:true}).click();
 await expect(page).toHaveURL(/\/(requests|work|management)$/);
}
test('PAGEUI01: older records, filtered search and reload remain reachable beyond 1,000 requests',async({page})=>{
 await login(page,'requester');
 const oldest=await (await page.request.get('/api/my-requests?sort=oldest&pageSize=1')).json();
 expect(oldest.pagination.total).toBeGreaterThan(1000);
 const old=oldest.requests[0];
 await expect(page.getByRole('button',{name:'Previous',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Next',exact:true}).click();
 await expect(page).toHaveURL(/page=2/);
 await expect(page.getByRole('status').filter({hasText:'matching requests. Page 2 of'})).toBeVisible();
 await page.getByLabel('Search title, location or reference').fill(old.request_id);
 await expect(page.locator('.request-table tbody tr')).toHaveCount(1);
 await expect(page.locator('.request-title')).toHaveText(old.title);
 await expect(page).toHaveURL(/page=1/);
 await expect(page.getByRole('button',{name:'Next',exact:true})).toBeDisabled();
 await page.reload();
 await expect(page.getByLabel('Search title, location or reference')).toHaveValue(old.request_id);
 await expect(page.locator('.request-table tbody tr')).toHaveCount(1);
 await page.getByLabel('Search title, location or reference').fill('no-matching-pagination-fixture');
 await expect(page.getByRole('heading',{name:'No matching requests'})).toBeVisible();
 await page.getByRole('button',{name:'Clear filters'}).click();
 await expect(page.locator('.request-table tbody tr')).toHaveCount(25);
 await page.goto('/requests?page=999');
 await expect(page.getByRole('button',{name:'Next',exact:true})).toBeDisabled();
 await expect(page.getByRole('button',{name:'Previous',exact:true})).toBeEnabled();
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'test-results/pagination-mobile.png',fullPage:true});
});
test('PAGEUI02: manager summary includes the complete authorised population, not one page',async({page})=>{
 await login(page,'manager');
 const queue=await (await page.request.get('/api/work')).json();
 expect(queue.pagination.total).toBeGreaterThan(1000);
 expect(queue.requests).toHaveLength(25);
 expect(queue.summary.total).toBe(queue.pagination.total);
 await page.goto('/management');
 await expect(page.locator('.metric-card').filter({has:page.getByRole('heading',{name:'All requests',exact:true})}).locator('.metric')).toHaveText(String(queue.summary.total));
 await expect(page.locator('.record-limit')).toContainText('all requests');
});
