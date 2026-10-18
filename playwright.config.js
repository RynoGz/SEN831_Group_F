import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'./tests/e2e',outputDir:'test-results/browser',fullyParallel:false,workers:1,timeout:45000,
 use:{baseURL:'http://127.0.0.1:3103',trace:'retain-on-failure'},
 reporter:[['list'],['json',{outputFile:'test-results/e2e.json'}]],
 webServer:[
  {command:'node tests/support/provider.mjs',url:'http://127.0.0.1:54329/health',reuseExistingServer:false,timeout:60000,env:{TEST_SEED_COUNT:'3300'}},
  {command:'npm start -- --hostname 127.0.0.1 --port 3103',url:'http://127.0.0.1:3103',reuseExistingServer:false,timeout:60000,env:{NEXT_PUBLIC_SUPABASE_URL:'http://127.0.0.1:54329',NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'local-simulation-publishable-key'}},
 ],
});
