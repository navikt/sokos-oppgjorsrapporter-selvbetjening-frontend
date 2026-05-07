import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';

function axeBuilder(page: Page): AxeBuilder {
  return new AxeBuilder({ page });
}

test.describe('Axe a11y', () => {
  test('Tom startside skal ikke ha noen a11y-feil', async ({ page }) => {
    await page.goto('/');

    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await axeBuilder(page).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('hopp til hovedinnhold - HTML-struktur er korrekt', async ({ page }) => {
    await page.goto('/oppgjorsrapporter/rapport/1');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('main#maincontent')).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });

  test('hopp til hovedinnhold-lenke fungerer', async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === 'webkit',
      'Safari håndterer tastaturfokus på en ikke-standard måte som gjør at denne testen feiler i Playwright/WebKit, ' +
        'selv om funksjonaliteten er verifisert til å fungere korrekt i Safari lokalt.',
    );
    await page.goto('/oppgjorsrapporter/rapport/1');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    const focusedText = await page.evaluate(() =>
      document.activeElement?.textContent?.trim(),
    );
    expect(focusedText?.toLowerCase()).toMatch(/hopp til hovedinnhold/i);
    await page.keyboard.press('Enter');
    const focusedTag = await page.evaluate(() =>
      document.activeElement?.tagName.toLowerCase(),
    );
    expect(focusedTag).toBe('main');
  });
});
