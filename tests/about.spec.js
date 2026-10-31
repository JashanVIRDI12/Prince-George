import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const TEL = "tel:+17782810200";

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
      links.filter((link) => !document.getElementById(link.hash.slice(1))).map((link) => link.hash),
    );
  expect(missing).toEqual([]);
  await page
    .locator(".site-header")
    .getByRole("link", { name: "Prince George Towing, home", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Towing and heavy recovery");
  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "About us" }).click();
  } else {
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "About us" }).click();
    await expect(
      page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "About us" }),
    ).toHaveAttribute("aria-current", "page");
  }
  await expect(page).toHaveURL(/\/about\/$/);
  await page.locator(".footer-links").getByRole("link", { name: "Our services" }).click();
  await expect(page).toHaveURL(/\/services\/$/);
  await page.locator(".footer-links").getByRole("link", { name: "About us" }).click();
  await expect(page).toHaveURL(/\/about\/$/);
});

test("the truck photo is real and its three labels are listed", async ({ page }) => {
  const photo = page.locator(".ab-truck-photo img");
  await expect(photo).toHaveAttribute("alt", /number 568/);
  const labels = page.locator(".ab-pin strong");
  await expect(labels).toHaveText(["Recovery boom", "Light bar", "Our number on the side"]);
});

test("the four steps read in the order a call happens", async ({ page }) => {
  const steps = page.getByRole("region", { name: "What happens when you call" }).getByRole("listitem");
  await expect(steps).toHaveCount(4);
  await expect(steps.getByRole("heading", { level: 3 })).toHaveText([
    "We listen.",
    "We plan the job.",
    "You get the details.",
    "We get you moving.",
  ]);
});

test("the gallery opens a service by pointer and keyboard", async ({ page }) => {
  const gallery = page.getByRole("group", { name: "Our work" });
  const panels = gallery.getByRole("button");
  await expect(panels).toHaveCount(5);
  await expect(gallery.locator("img")).toHaveCount(5);
  await expect(gallery.getByRole("button", { name: "Heavy-duty towing" })).toHaveAttribute("aria-pressed", "true");
  await gallery.getByRole("button", { name: "Roadside assistance" }).click();
  await expect(gallery.getByRole("button", { name: "Roadside assistance" })).toHaveAttribute("aria-pressed", "true");
  const detail = page.locator("#ab-gallery-detail");
  await expect(detail).toContainText("Battery boosts, tire changes");
  await expect(detail.getByRole("link", { name: "Explore roadside assistance" })).toHaveAttribute(
    "href",
    "/services/roadside/",
  );
  await gallery.getByRole("button", { name: "Car towing" }).focus();
  await page.keyboard.press("Enter");
  await expect(gallery.getByRole("button", { name: "Car towing" })).toHaveAttribute("aria-pressed", "true");
  await expect(detail).toContainText("Cars, SUVs, pickups and vans");
});

test("road tabs control the real map by pointer and keyboard", async ({ page }) => {
  const tabs = page.getByRole("tablist", { name: "Roads out of Prince George" });
  const panel = page.locator("#ab-roads-panel");
  await expect(panel).toContainText("From city streets to nearby highways");
  await page.locator(".ab-roads-map").scrollIntoViewIfNeeded();
  const localMap = page.locator(".ab-roads-map .leaflet-container");
  await expect(localMap).toBeVisible();
  await expect(page.locator(".ab-roads-map .real-area-marker")).toHaveCount(4);
  await expect(page.locator(".ab-roads-map .leaflet-control-attribution")).toContainText("OpenStreetMap");
  await page.locator(".ab-roads-map").getByRole("button", { name: "Show Highway 16 West coverage" }).click();
  await expect(panel).toContainText("Travelling west?");
  await expect(tabs.getByRole("tab", { name: /Highway 16 West/ })).toHaveAttribute("aria-selected", "true");
  await expect(localMap).toHaveAttribute("data-area", "west");
  await tabs.getByRole("tab", { name: /Highway 16 West/ }).click();
  await page.keyboard.press("End");
  await expect(tabs.getByRole("tab", { name: /Highway 97 South/ })).toBeFocused();
  await expect(panel).toContainText("The Cariboo Highway route");
  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: /Prince George/ })).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(tabs.getByRole("tab", { name: /Highway 97 South/ })).toBeFocused();
  await page.keyboard.press("Home");
  await expect(panel).toContainText("From city streets to nearby highways");
  await page.getByRole("link", { name: "Explore service areas", exact: true }).click();
  await expect(page).toHaveURL(/\/#coverage$/);
  await expect(page.locator("#coverage")).toBeInViewport();
  await expect(page.locator(".route-map")).toBeVisible();
});

test("the closing action calls dispatch, and contact is one link away", async ({ page }) => {
  const closing = page.locator(".closing");
  await expect(closing.getByRole("link", { name: "Call dispatch" })).toHaveAttribute("href", TEL);
  await expect(closing.locator(".closing-number")).toHaveAttribute("href", TEL);
  await closing.getByRole("link", { name: "More ways to reach us" }).click();
  await expect(page).toHaveURL(/\/contact\/$/);
});

test("about layout fits all screen sizes and images load", async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = "eager";
    await Promise.all([...document.images].map((img) => img.decode()));
  });
  expect(
    await page
      .locator("main img")
      .evaluateAll((images) => images.every((img) => img.complete && img.naturalWidth > 0)),
  ).toBe(true);
});

test("about interactive content passes accessibility checks", async ({ page }) => {
  await page.getByRole("tab", { name: /Highway 97 North/ }).click();
  await page.locator(".ab-roads-map").scrollIntoViewIfNeeded();
  await expect(page.locator(".ab-roads-map .leaflet-container")).toBeVisible();
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(result.violations).toEqual([]);
});

test("with motion: the title reveals, the steps play through, the gallery reflows", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/about/");
  const title = page.getByRole("heading", { level: 1 });
  await expect(title).toHaveAccessibleName("The help you need when things stop moving");
  await expect(title).toBeVisible();

  // Scrolling to the end of the pinned steps leaves the last one showing.
  const stepsEnd = await page
    .locator(".ab-steps-stage")
    .evaluate((el) => el.parentElement.getBoundingClientRect().bottom + scrollY - innerHeight);
  await page.evaluate((y) => window.scrollTo(0, y - 20), stepsEnd);
  await expect
    .poll(() =>
      page.locator(".ab-step").last().locator(".ab-step-copy").evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBeGreaterThan(0.95);

  const panels = page.getByRole("group", { name: "Our work" }).getByRole("button");
  await panels.nth(0).scrollIntoViewIfNeeded();
  await panels.nth(0).click();
  await expect(panels.nth(0)).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(async () => {
      const chosen = await panels.nth(0).boundingBox();
      const other = await panels.nth(1).boundingBox();
      return chosen.width > other.width || chosen.height > other.height;
    })
    .toBe(true);

  // Arriving from another page at the map lands below the header.
  await page.goto("/about/#where-we-work");
  await page.reload();
  const heading = page.locator("#ab-roads-title");
  await expect(heading).toBeInViewport();
  await page.getByRole("tab", { name: /Highway 97 North/ }).click();
  await expect(page.locator("#ab-roads-panel")).toContainText("Heading north from Prince George");
  expect(errors).toEqual([]);
});
