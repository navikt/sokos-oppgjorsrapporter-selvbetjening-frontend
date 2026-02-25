import { expect, test } from '@playwright/test';

/* TODO - fikser senere
import AxeBuilder from '@axe-core/playwright';
test('viser rapport metadata', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/rapport/1`);
  await page.getByRole('button', { name: 'Ja' }).click();

  await expect(
    page.getByRole('heading', {
      name: /Oppgjørsrapport arbeidsgiver – refusjoner fra Nav. Utbetalt 15.01.2023/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', {
      name: /Oppgjørsrapport arbeidsgiver – refusjoner fra Nav - PDF/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', {
      name: /Oppgjørsrapport arbeidsgiver – refusjoner fra Nav - CSV/i,
    }),
  ).toBeVisible();

  // Accessibility check
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
*/

test('viser feilmelding ved ugyldig rapportId', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/rapport/ugyldig-id`);

  await expect(page.getByText('Det oppstod en feil')).toBeVisible();
});
