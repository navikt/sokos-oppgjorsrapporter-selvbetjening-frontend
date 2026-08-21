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

test('forespurt rapport er ekspandert', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/rapport/1`);

  const rapportTittel = page.getByText(
    'Oppgjørsrapport arbeidsgiver – refusjoner fra Nav. Utbetalt 31.01.2026',
  );
  const rapportHeader = page
    .locator('div.aksel-expansioncard__header')
    .filter({ has: rapportTittel });
  const ekspandert = await rapportHeader.getAttribute('data-open');

  expect(ekspandert).toEqual('true');
});

test('forespurt rapport viser nedlastningsinfo', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/rapport/2`);
  await expect(
    page.getByText('Sist lastet ned  01.03.2026, 11:00'),
  ).toBeVisible();
});

test('forespurt rapport er fargekodet riktig dersom den ikke er lastet ned', async ({
  page,
  baseURL,
}) => {
  await page.goto(`${baseURL}/rapport/1`);

  const rapportTittel = page.getByText(
    'Oppgjørsrapport arbeidsgiver – refusjoner fra Nav. Utbetalt 31.01.2026',
  );
  const rapportKort = page.locator('section').filter({ has: rapportTittel });

  const farge = await rapportKort.getAttribute('data-color');

  expect(farge).toEqual('brand-beige');
});

test('forespurt rapport er synlig (skrollet til)', async ({
  page,
  baseURL,
}) => {
  await page.goto(`${baseURL}/rapport/1`);

  const rapportTittel = page.getByText(
    'Oppgjørsrapport arbeidsgiver – refusjoner fra Nav. Utbetalt 31.01.2026',
  );
  const rapportKort = page.locator('section').filter({ has: rapportTittel });
  await expect(rapportKort).toBeInViewport();
});
