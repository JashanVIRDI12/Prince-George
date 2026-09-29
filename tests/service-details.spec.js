import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  ["towing", "Towing & Recovery", "Towing & recovery", "Get towing help"],
  ["roadside", "Roadside Assistance", "Roadside assistance", "Get roadside help"],
  ["heavy", "Heavy-Duty Hauling", "Heavy-duty hauling", "Get heavy-duty help"],
];

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("service pages have direct routes, working details, and the right request type", async ({ page }) => {
  for (const [id, title, heading, action] of pages) {
    await page.goto(`/services/${id}/`);
    await expect(page).toHaveTitle(`${title} | Prince George Towing`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(`${heading}.`);
    const hero = page.locator(".sd-hero-photo");
    await expect(hero).toHaveJSProperty("complete", true);
    expect(await hero.evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
    await page.reload();
    await expect(page.locator(".service-detail-page")).toBeVisible();
    const firstCapability = page.locator(".sd-capability-list details").first();
    await firstCapability.locator("summary").click();
    await expect(firstCapability).toHaveAttribute("open", "");
    await page.getByRole("button", { name: action }).first().click();
    await expect(page.getByRole("dialog").getByRole("radio", { name: heading })).toBeChecked();
    await page.getByRole("dialog").getByRole("button", { name: "Close dialog" }).click();
  }
});

test("services dropdown opens with keyboard and links to service pages", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    const nav = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(nav.getByRole("link", { name: "Service areas" })).toHaveCount(0);
    const toggle = nav.locator(".mobile-services-heading button");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await nav.getByRole("link", { name: /Roadside assistance/ }).click();
    await expect(page).toHaveURL(/\/services\/roadside\/$/);
  } else {
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await expect(nav.getByRole("link", { name: "Service areas" })).toHaveCount(0);
    const toggle = nav.locator(".nav-services-toggle");
    await toggle.focus();
    await toggle.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    const dropdown = page.locator("#services-dropdown");
    await expect(dropdown).toBeVisible();
    await expect(dropdown.locator("img")).toHaveCount(3);
    await toggle.press("Escape");
    await expect(dropdown).toBeHidden();
    await expect(toggle).toBeFocused();
    await toggle.click();
    await dropdown.getByRole("link", { name: /Towing & recovery/ }).click();
    await expect(page).toHaveURL(/\/services\/towing\/$/);
  }
});

test("desktop services dropdown opens on hover and stays open across the header gap", async ({ page, isMobile }) => {
  test.skip(isMobile);
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  const dropdown = page.locator("#services-dropdown");
  await nav.getByRole("link", { name: /Services/ }).hover();
  await expect(dropdown).toBeVisible();
  await dropdown.getByRole("link", { name: /Roadside assistance/ }).hover();
  await page.waitForTimeout(300);
  await expect(dropdown).toBeVisible();
  await page.locator(".site-header .brand").hover();
  await expect(dropdown).toBeHidden();
});

test("service detail layouts fit common widths and pass accessibility checks", async ({ page }) => {
  await page.goto("/services/roadside/");
  await page.evaluate(() => document.fonts.ready);
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
});
