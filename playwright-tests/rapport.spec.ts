import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('viser feilmelding ved ugyldig rapportId — og har ingen a11y-feil', async ({
  page,
  baseURL,
}) => {
  await page.goto(`${baseURL}/rapport/ugyldig-id`);
  await expect(page.getByText('Det oppstod en feil')).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('viser feilmelding ved feilet nedlasting — og har ingen a11y-feil', async ({
  page,
  baseURL,
}) => {
  await page.route('**/rapport/*/innhold*', (route) =>
    route.fulfill({ status: 500 }),
  );

  await page.goto(`${baseURL}/rapport/1`);
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /Last ned PDF/i }).click();
  await expect(
    page.getByRole('heading', { name: 'Feil ved nedlasting' }),
  ).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
