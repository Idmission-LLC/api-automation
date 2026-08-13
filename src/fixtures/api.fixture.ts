import { test as base } from '@playwright/test';
import { CustomerClient } from '../clients/CustomerClient';

type ApiFixtures = {
  customerClient: CustomerClient;
};

export const test = base.extend<ApiFixtures>({
  customerClient: async ({ request }, use) => {
    await use(new CustomerClient(request));
  },
});

export { expect } from '@playwright/test';
