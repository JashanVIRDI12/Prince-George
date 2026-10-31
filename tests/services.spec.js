import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const TEL = "tel:+17782810200";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/services/");
  await page.evaluate(() => document.fonts.ready);
});

test("services page loads directly, survives reload, and connects to the homepage", async ({
  page,
  isMobile,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await expect(page).toHaveTitle("Towing Services | Prince George Towing");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Towing & recovery services",
  );
  await page.reload();
  await expect(page.locator(".services-page")).toBeVisible();
  const missingTargets = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .filter((link) => !document.getElementById(link.hash.slice(1)))
        .map((link) => link.href),
    );
  expect(missingTargets).toEqual([]);
  await page
    .locator(".site-header")
    .getByRole("link", { name: "Prince George Towing, home", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Towing and heavy recovery",
  );
  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Services", exact: false })
      .click();
  } else {
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Services", exact: false })
      .click();
  }
  await expect(page).toHaveURL(/\/services\/$/);
  await expect(page.locator(".services-page")).toBeVisible();
  await page.locator(".footer-links").getByRole("link", { name: "About us" }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "The help you need when things stop moving",
  );
  expect(errors).toEqual([]);
});

test("the strip and the chapters cover all five services", async ({ page }) => {
  const strip = page.getByRole("navigation", { name: "The five services" });
  await expect(strip.getByRole("link")).toHaveCount(5);
  for (const [id, title, action] of [
    ["towing", "Car towing", "Get towing help"],
    ["heavy", "Heavy-duty towing", "Get heavy-duty help"],
    ["equipment", "Heavy equipment transport", "Get equipment transport help"],
    ["offloading", "Offloading", "Get offloading help"],
    ["roadside", "Roadside assistance", "Get roadside help"],
  ]) {
    const chapter = page.locator(`article#${id}`);
    await expect(chapter.getByRole("heading", { level: 2 })).toHaveText(title);
    await expect(chapter.locator(".chapter-handles li")).toHaveCount(4);
    await expect(chapter.getByRole("link", { name: action, exact: true })).toHaveAttribute("href", TEL);
    await expect(chapter.getByRole("link", { name: `${title} in detail` })).toHaveAttribute(
      "href",
      `/services/${id}/`,
    );
  }
  await strip.getByRole("link", { name: /Offloading/ }).click();
  await expect(page.locator("#chapter-offloading")).toBeInViewport();
});

test("the finder answers each situation and works by keyboard", async ({ page }) => {
  const tabs = page.getByRole("tablist", { name: "Choose what happened" });
  const panel = page.locator("#finder-panel");
  await tabs.scrollIntoViewIfNeeded();
  await expect(panel).toHaveAttribute("data-service", "roadside");
  await tabs.getByRole("tab", { name: "It’s a bus, coach or semi" }).click();
  await expect(panel).toHaveAttribute("data-service", "heavy");
  await expect(panel.getByRole("heading", { level: 3 })).toHaveText("Heavy-duty towing");
  await expect(panel.getByRole("link", { name: "Get heavy-duty help" })).toHaveAttribute("href", TEL);
  await tabs.getByRole("tab", { name: "It’s a bus, coach or semi" }).press("ArrowDown");
  await expect(tabs.getByRole("tab", { name: "A machine needs moving" })).toBeFocused();
  await expect(panel).toHaveAttribute("data-service", "equipment");
  await page.keyboard.press("End");
  await expect(panel).toHaveAttribute("data-service", "offloading");
  await page.keyboard.press("Home");
  await expect(tabs.getByRole("tab", { name: "It won’t start" })).toBeFocused();
  await panel.getByRole("link", { name: "Roadside assistance in detail" }).click();
  await expect(page).toHaveURL(/\/services\/roadside\/$/);
});

test("price factors and questions are readable and accessible", async ({ page }) => {
  await expect(page.locator(".price-item")).toHaveCount(5);
  await expect(page.locator(".price-head")).toContainText("before anything moves");
  const cost = page.getByRole("button", { name: "What is this going to cost me?" });
  await expect(cost).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("region", { name: "What is this going to cost me?" })).toContainText(
    "The cost depends on the service required",
  );
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("service layouts fit mobile through desktop and photography loads", async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth), {
        message: `Layout fits a ${width}px viewport`,
      })
      .toBeLessThanOrEqual(width);
  }
  await page.evaluate(async () => {
    for (const image of document.images) image.loading = "eager";
    await Promise.all([...document.images].map((image) => image.decode()));
  });
  expect(
    await page
      .locator(".services-page img")
      .evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)),
  ).toBe(true);
});

test("with motion: the index follows the chapters and direct links land", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  // Arrive from elsewhere, as a link from another page would.
  await page.goto("/services/#heavy");
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("#chapter-heavy")).toBeInViewport();
  if ((page.viewportSize()?.width ?? 0) > 900) {
    const index = page.getByRole("navigation", { name: "Services on this page" });
    await expect(index.getByRole("link", { name: "Heavy-duty towing" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    await index.getByRole("link", { name: "Roadside assistance" }).click();
    await expect(page.locator("#chapter-roadside")).toBeInViewport();
    await expect(index.getByRole("link", { name: "Roadside assistance" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  }
  const photo = page.locator("#heavy .chapter-photo");
  await photo.scrollIntoViewIfNeeded();
  await expect(photo.locator("img")).toBeVisible();
  await page.locator("#finder").scrollIntoViewIfNeeded();
  await page.getByRole("tab", { name: "A load needs to come off a truck" }).click();
  await expect(page.locator("#finder-panel")).toHaveAttribute("data-service", "offloading");
  await expect
    .poll(() =>
      page.locator(".fx-copy h3").evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBe(1);
  expect(errors).toEqual([]);
});
