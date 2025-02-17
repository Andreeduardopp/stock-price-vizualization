import { test, expect } from "@playwright/test";
import { error } from "console";

test.describe("Home Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/"); 
  });

  test("Home page loads correctly", async ({ page }) => {
    await expect(page.locator("h2")).toHaveText("Stock Search");
    await expect(page.locator("#search")).toContainText("Search");
  });

  test("User can search for a stock", async ({ page }) => {
    await page.route("**/api/stocks?ticker=AAPL**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [
              { date: "2024-02-01", price: 150 },
              { date: "2024-02-02", price: 152 },
              { date: "2024-02-03", price: 155 },
            ],
          }),
        });
        });
    await page.fill("input[type='text']", "AAPL");
    await page.click("button");
    await expect(page.locator("text=Loading...")).toBeHidden();
  });


  test("Snackbar appears on invalid search", async ({ page }) => {
    await page.route("**/api/stocks?ticker=INVALID**", async (route) => {
        await route.fulfill({
          status: 404,
          contentType: "application/json",
          body: JSON.stringify({error: "Stock data not found!"}),
        });
        });
    await page.fill("input[type='text']", "INVALID");
    await page.click("button");
    await expect(page.locator("text=No data available")).toBeVisible();
});

    test("Search button should be disabled when end date is before start date", async ({ page }) => {
    await page.goto("/");
    await page.click("#custom");
    const today = new Date().toISOString().split("T")[0];
    await page.fill("#start-date", today);
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);
    const pastDateStr = pastDate.toISOString().split("T")[0];
    await page.fill("#end-date", pastDateStr);
    await expect(page.locator("text=A data de término deve ser maior que a data de início.")).toBeVisible();

    await expect(page.locator("#search")).toBeDisabled();
    });
});
