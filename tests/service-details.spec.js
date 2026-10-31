import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const TEL = "tel:+17782810200";
const pages = [
  ["towing", "Car Towing", "Car towing", "Get towing help"],
  ["roadside", "Roadside Assistance", "Roadside assistance", "Get roadside help"],
  ["heavy", "Heavy-Duty & Bus Towing", "Heavy-duty towing", "Get heavy-duty help"],
  ["equipment", "Heavy Equipment Transport", "Heavy equipment transport", "Get equipment transport help"],
  ["offloading", "Offloading Services", "Offloading", "Get offloading help"],
];

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("service pages have direct routes, their content, and call dispatch", async ({ page }) => {
  for (const [id, title, heading, action] of pages) {
    await page.goto(`/services/${id}/`);
    await expect(page).toHaveTitle(`${title} | Prince George Towing`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expect(
      page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Services" }),
    ).toHaveAttribute("href", "/services/");
    const hero = page.locator(".sp-photo img");
    await expect.poll(() => hero.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
    await page.reload();
    await expect(page.locator(".service-page")).toBeVisible();
    // Four things the service handles, three steps before calling.
    await expect(page.locator(".sp-handle")).toHaveCount(4);
    await expect(page.locator(".sp-step")).toHaveCount(3);
    await expect(page.locator(".sp-statement")).not.toBeEmpty();
    // Every call action dials dispatch.
    for (const link of await page.getByRole("link", { name: action }).all())
      await expect(link).toHaveAttribute("href", TEL);
    await expect(page.getByRole("link", { name: action })).toHaveCount(3);
    // The other four services are one click away.
    await expect(page.locator(".sp-other")).toHaveCount(4);
    await expect(page.locator(`.sp-other[href="/services/${id}/"]`)).toHaveCount(0);
    // Questions open one at a time.
    const questions = page.locator("#questions .qa button");
    await expect(questions.first()).toHaveAttribute("aria-expanded", "true");
    await questions.nth(1).click();
    await expect(questions.nth(1)).toHaveAttribute("aria-expanded", "true");
    await expect(questions.first()).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("heading", { level: 2, name: new RegExp(`Need ${heading}`, "i") })).toBeVisible();
  }
});

test("service pages link back home and across to the other services", async ({ page }) => {
  await page.goto("/services/towing/");
  const anchors = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) => links.filter((link) => !document.getElementById(link.hash.slice(1))).map((link) => link.href));
  expect(anchors).toEqual([]);
  await page.getByRole("link", { name: "What to have ready" }).click();
  await expect(page.locator("#before-you-call h2")).toBeInViewport();
  await page.locator(".sp-other", { hasText: "Heavy-duty towing" }).click();
  await expect(page).toHaveURL(/\/services\/heavy\/$/);
  await page
    .locator(".site-header")
    .getByRole("link", { name: "Prince George Towing, home", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Towing and heavy recovery");
});

test("with motion the title and photo settle and the steps light up", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/services/equipment/");
  const photo = page.locator(".sp-photo");
  await expect
    .poll(() => photo.evaluate((el) => getComputedStyle(el).clipPath))
    .toMatch(/^inset\(0(%|px)( 0(%|px))*\)$|^none$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Heavy equipment transport");
  const lastStep = page.locator(".sp-step").last();
  await lastStep.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await expect.poll(() => lastStep.evaluate((el) => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0.9);
  await expect(page.getByRole("link", { name: "Get equipment transport help" }).first()).toHaveAttribute("href", TEL);
  expect(errors).toEqual([]);
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
    await expect(dropdown.locator("img")).toHaveCount(5);
    // The photos are lazy: they are only requested once the menu is open.
    await expect
      .poll(() => dropdown.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)))
      .toBe(true);
    await toggle.press("Escape");
    await expect(dropdown).toBeHidden();
    await expect(toggle).toBeFocused();
    await toggle.click();
    await dropdown.getByRole("link", { name: /Car towing/ }).click();
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
