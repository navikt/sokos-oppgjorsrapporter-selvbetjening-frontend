import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('happy-path: Organisasjonsvelger', () => {
  test('kan vise organisasjonsstruktur', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/ref-arbg`);
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByRole('link', { name: 'Ridabu og Malmefjord regnskap AS' }),
    ).toBeVisible();
  });

  test('kan filtrere på organisasjoner', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/ref-arbg`);
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByRole('link', { name: 'Ridabu og Malmefjord regnskap AS' }),
    ).toBeVisible();
    await page.getByLabel('Søk eller velg i listen').fill('indre');
    await expect(
      page.getByRole('link', { name: 'Ridabu og Malmefjord regnskap AS' }),
    ).not.toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Indreflytten idrettslag' }),
    ).toBeVisible();
  });

  test('ingen a11y-feil', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/ref-arbg`);
    await page.waitForLoadState('networkidle');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toHaveLength(0);
  });
});

test.describe('happy-path: Oppgjørsrapporter for orgnummer', () => {
  test('viser rapporter for orgnummer', async ({
    page,
    baseURL,
  }) => {
    await page.goto(`${baseURL}/ref-arbg/987654321`);
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByRole('heading', {
        name: 'Oppgjørsrapport arbeidsgiver – refusjoner fra Nav',
        level: 1,
      }),
    ).toBeVisible();
    await expect(page.getByRole('heading', {
        name: 'Oppgjørsrapport arbeidsgiver – refusjoner fra Nav',
        level: 3,
      })
    ).toHaveCount(3)
  });
});

test.describe('error-state', () => {
  test('ingen a11y-feil', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/ref-arbg/error`);
    await page.waitForLoadState('networkidle');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toHaveLength(0);
  });
});
