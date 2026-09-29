import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("https://tile.openstreetmap.org/**", (route) =>
    route.fulfill({
      contentType: "image/png",
      body: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6Z9sAAAAASUVORK5CYII=",
        "base64",
      ),
    }),
  );
  await page.goto("/about/");
  await page.evaluate(() => document.fonts.ready);
});

test("about loads directly, reloads, and connects to main navigation and footer", async ({
  page,
  isMobile,
}) => {
  await expect(page).toHaveTitle("About Us | Prince George Towing");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "The help you need when things stop moving",
  );
  await page.reload();
  const missing = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .filter((link) => !document.getElementById(link.hash.slice(1)))
        .map((link) => link.hash),
    );
  expect(missing).toEqual([]);
  await page
    .getByRole("link", { name: "Prince George Towing, home", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "STUCK ON",
  );
  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "About us" })
      .click();
  } else {
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "About us" })
      .click();
    await expect(
      page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "About us" }),
    ).toHaveAttribute("aria-current", "page");
  }
  await expect(page).toHaveURL(/\/about\/$/);
  await page
    .locator(".footer-links")
    .getByRole("link", { name: "Our services" })
    .click();
  await expect(page).toHaveURL(/\/services\/$/);
  await page
    .locator(".footer-links")
    .getByRole("link", { name: "About us" })
    .click();
  await expect(page).toHaveURL(/\/about\/$/);
});

test("the four steps read in the order a call happens", async ({ page }) => {
  const steps = page
    .getByRole("region", { name: "What happens when you call" })
    .getByRole("listitem");
  await expect(steps).toHaveCount(4);
  await expect(steps.getByRole("heading", { level: 3 })).toHaveText([
    "We listen.",
    "We plan the job.",
    "You get the details.",
    "We get you moving.",
  ]);
});

test("road tabs control the real map by pointer and keyboard", async ({
  page,
}) => {
  const tabs = page.getByRole("tablist", { name: "Roads out of Prince George" });
  const panel = page.getByRole("tabpanel");
  await expect(panel).toContainText("From city streets to nearby highways");
  await expect(page.locator(".ab-roads-sketch")).toHaveCount(0);
  await page.locator(".ab-roads-map").scrollIntoViewIfNeeded();
  const localMap = page.locator(".ab-roads-map .leaflet-container");
  await expect(localMap).toBeVisible();
  await expect(page.locator(".ab-roads-map .real-area-marker")).toHaveCount(4);
  await expect(page.locator(".ab-roads-map .leaflet-control-attribution")).toContainText("OpenStreetMap");
  await page.locator(".ab-roads-map").getByRole("button", { name: "Show Highway 16 West coverage" }).click();
  await expect(panel).toContainText("Travelling west?");
  await expect(tabs.getByRole("tab", { name: /Highway 16 West/ })).toHaveAttribute("aria-selected", "true");
  await tabs.getByRole("tab", { name: /Highway 16 West/ }).click();
  await expect(panel).toContainText("Travelling west?");
  await expect(localMap).toHaveAttribute("data-area", "west");
  await expect(tabs.getByRole("tab", { name: /Highway 16 West/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.keyboard.press("End");
  await expect(tabs.getByRole("tab", { name: /Highway 97 South/ })).toBeFocused();
  await expect(panel).toContainText("The Cariboo Highway route");
  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: /Prince George/ })).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(tabs.getByRole("tab", { name: /Highway 97 South/ })).toBeFocused();
  await page.keyboard.press("Home");
  await expect(panel).toContainText("From city streets to nearby highways");
  await page
    .getByRole("link", { name: "Explore service areas", exact: true })
    .click();
  await expect(page).toHaveURL(/\/#coverage$/);
  await expect(page.locator("#coverage")).toBeInViewport();
  await expect(page.locator(".leaflet-container")).toBeVisible();
});

test("the closing action opens a request, restores focus, and contact is one link away", async ({
  page,
}) => {
  const help = page
    .locator(".ab-close")
    .getByRole("button", { name: "Get help now" });
  await help.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(help).toBeFocused();
  await page
    .locator(".ab-close")
    .getByRole("link", { name: "Contact us", exact: true })
    .click();
  await expect(page).toHaveURL(/\/contact\/$/);
});

test("about layout fits all screen sizes and images load", async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(width);
  }
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = "eager";
    await Promise.all([...document.images].map((img) => img.decode()));
  });
  expect(
    await page
      .locator(".ab img")
      .evaluateAll((images) =>
        images.every((img) => img.complete && img.naturalWidth > 0),
      ),
  ).toBe(true);
});

test("about interactive content passes accessibility checks", async ({
  page,
}) => {
  await page.getByRole("tab", { name: /Highway 97 North/ }).click();
  await page.locator(".ab-roads-map").scrollIntoViewIfNeeded();
  await expect(page.locator(".ab-roads-map .leaflet-container")).toBeVisible();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});

test("field scenes show the equipment and update their service detail", async ({ page }) => {
  const gallery = page.getByRole("region", { name: "Every call has a story" });
  const buttons = gallery.locator(".ab-field-card");
  await expect(buttons).toHaveCount(3);
  await expect(gallery.locator(".ab-field-card img")).toHaveCount(3);
  await expect(buttons.nth(1)).toHaveAttribute("aria-pressed", "true");
  await buttons.nth(0).click();
  await expect(buttons.nth(0)).toHaveAttribute("aria-pressed", "true");
  await expect(gallery.locator("#ab-field-detail")).toContainText("A boost, a tire, a way forward.");
  await expect(gallery.getByRole("link", { name: /Explore roadside help/ })).toHaveAttribute("href", "/services/roadside/");
  await buttons.nth(2).focus();
  await page.keyboard.press("Enter");
  await expect(buttons.nth(2)).toHaveAttribute("aria-pressed", "true");
  await expect(gallery.locator("#ab-field-detail")).toContainText("The right move for heavy loads");
});

test("with motion, the title reveals and scene selection changes layout", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/about/");
  const title = page.getByRole("heading", { level: 1 });
  await expect(title).toContainText("The help you need when things stop moving");
  await expect(title).toBeVisible();
  await expect(page.locator(".ab-title-line").first()).toBeVisible();
  const cards = page.locator(".ab-field-card");
  await cards.nth(0).click();
  await expect(cards.nth(0)).toHaveAttribute("aria-pressed", "true");
  await expect.poll(async () => {
    const first = await cards.nth(0).boundingBox();
    const second = await cards.nth(1).boundingBox();
    return first.width > second.width || first.height > second.height;
  }).toBe(true);
  await page.goto("/about/#where-we-work");
  const heading = page.locator("#ab-roads-title");
  await expect(heading).toBeInViewport();
  const top = await heading.boundingBox();
  const header = await page.locator(".site-header").boundingBox();
  expect(top.y).toBeGreaterThanOrEqual(header.y + header.height);
  await page.getByRole("tab", { name: /Highway 97 North/ }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Heading north from Prince George");
  expect(errors).toEqual([]);
});
