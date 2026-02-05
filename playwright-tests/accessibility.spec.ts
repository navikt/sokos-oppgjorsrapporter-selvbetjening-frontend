import AxeBuilder from "@axe-core/playwright";
import { type Page, expect, test } from "@playwright/test";

function axeBuilder(page: Page): AxeBuilder {
  return new AxeBuilder({ page }).disableRules(["page-has-heading-one"]);
}

test.describe("Axe a11y", () => {
  test("Tom startside skal ikke ha noen a11y-feil", async ({
    page,
  }) => {
    await page.goto("/");

    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await axeBuilder(page).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
