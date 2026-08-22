import { test as base } from '@playwright/test';
import { CustomerClient } from '../clients/CustomerClient';

type ApiFixtures = {
  customerClient: CustomerClient;
};

export const test = base.extend<ApiFixtures>({
  customerClient: async ({ request }, use, testInfo) => {
    let companyName = 'default';
    for (const tag of testInfo.tags) {
      if (tag.startsWith('@company:')) {
        companyName = tag.replace('@company:', '');
        break;
      }
    }
    await use(new CustomerClient(request, companyName));
  },
});

export { expect } from '@playwright/test';
