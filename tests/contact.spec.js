import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const TEL = "tel:+17782810200";

const princeGeorgeMinutes = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Vancouver",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const read = (type) => Number(parts.find((p) => p.type === type).value);
  return (read("hour") % 24) * 60 + read("minute");
};

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/contact/");
  await page.evaluate(() => document.fonts.ready);
});

test("contact loads directly, reloads, and connects to navigation and footer", async ({ page, isMobile }) => {
  await expect(page).toHaveTitle("Contact | Prince George Towing");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Need a tow? Let’s get you moving.");
  await expect
    .poll(() => page.locator(".ct-photo img").evaluate((img) => img.complete && img.naturalWidth > 0))
    .toBe(true);
  await page.reload();
  const missing = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links.filter((link) => !document.getElementById(link.hash.slice(1))).map((link) => link.hash),
    );
  expect(missing).toEqual([]);

  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Services" }).click();
  } else {
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Services" }).click();
  }
  await expect(page).toHaveURL(/\/services\/$/);
  await page.locator(".footer-links").getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/\/contact\/$/);
  if (!isMobile)
    await expect(
      page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Contact" }),
    ).toHaveAttribute("aria-current", "page");
});

test("the dispatch number is the hero and calls dispatch", async ({ page }) => {
  const number = page.locator(".ct-number");
  await expect(number).toHaveAttribute("href", TEL);
  await expect(number).toHaveAccessibleName("Call 778-281-0200");
  await expect(page.locator(".ct-hero-foot").getByRole("link", { name: "Call dispatch" })).toHaveAttribute("href", TEL);
  await expect(page.locator(".ct-911")).toContainText("call 911 first");
  const links = await page.locator('a[href^="tel:"]').evaluateAll((all) => all.map((a) => a.getAttribute("href")));
  expect(new Set(links)).toEqual(new Set([TEL]));
});

test("the dispatch dial reads the real time in Prince George", async ({ page }) => {
  const digits = page.locator(".ct-dial-read .ct-dial-digits");
  await expect(digits).toHaveCount(2);
  await expect
    .poll(async () => (await digits.allTextContents()).every((value) => /^\d{2}$/.test(value)))
    .toBe(true);
  const [hours, minutes] = (await digits.allTextContents()).map(Number);
  expect(Math.abs(hours * 60 + minutes - princeGeorgeMinutes())).toBeLessThanOrEqual(1);
  // The arc reports the same instant as the digits.
  const swept = await page.locator(".ct-dial-arc").evaluate((node) => {
    const total = Number(node.getAttribute("stroke-dasharray"));
    return 1 - Number(getComputedStyle(node).strokeDashoffset.replace("px", "")) / total;
  });
  expect(Math.abs(swept - (hours * 60 + minutes) / 1440)).toBeLessThan(0.02);
});

test("service chooser works by keyboard and calls dispatch", async ({ page }) => {
  const tabs = page.getByRole("tablist", { name: "Choose the help you need" });
  const panel = page.locator("#ct-service-panel");
  await expect(tabs.getByRole("tab", { name: "Heavy-duty towing" })).toHaveAttribute("aria-selected", "true");
  await expect(panel.getByRole("heading", { level: 3 })).toHaveText("Heavy-duty towing");
  await expect(panel.locator("img")).toHaveAttribute("src", /heavy-towing/);
  // The photo loads lazily, so bring it on screen first.
  await panel.locator("img").scrollIntoViewIfNeeded();
  await expect.poll(() => panel.locator("img").evaluate((img) => img.naturalWidth)).toBeGreaterThan(0);
  await expect(panel.getByRole("link", { name: "Get heavy-duty help" })).toHaveAttribute("href", TEL);
  await tabs.getByRole("tab", { name: "Heavy-duty towing" }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(tabs.getByRole("tab", { name: "Heavy equipment transport" })).toBeFocused();
  await expect(panel.getByRole("link", { name: "Get equipment transport help" })).toHaveAttribute("href", TEL);
  await page.keyboard.press("End");
  await expect(panel).toHaveAttribute("data-service", "roadside");
  await page.keyboard.press("Home");
  await expect(panel).toHaveAttribute("data-service", "towing");
  await expect(panel.getByRole("link", { name: "Get towing help" })).toHaveAttribute("href", TEL);
});

test("four things to tell us stay readable without motion", async ({ page }) => {
  for (const title of ["Where you are", "What you drive", "What happened", "Where it needs to go"])
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  await expect(page.locator(".ct-card-note", { hasText: "call 911 first" })).toBeVisible();
});

test("questions open and close one at a time, by pointer and keyboard", async ({ page }) => {
  const first = page.getByRole("button", { name: /What should I do while I wait for help/ });
  const reach = page.getByRole("button", { name: /How quickly can you reach my location/ });
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("move away from traffic and turn on your hazard lights", { exact: false }).first()).toBeVisible();
  await reach.click();
  await expect(reach).toHaveAttribute("aria-expanded", "true");
  await expect(first).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByText("Response times depend on your location", { exact: false })).toBeVisible();
  await reach.press("Enter");
  await expect(reach).toHaveAttribute("aria-expanded", "false");
  await reach.press("Enter");
  await expect(reach).toHaveAttribute("aria-expanded", "true");
  await expect(reach).toBeFocused();
});

test("service areas are listed and reach the map", async ({ page }) => {
  await expect(page.locator(".ct-reach-name")).toHaveText([
    "Prince George",
    "Highway 16 West",
    "Highway 97 North",
    "Highway 97 South",
  ]);
  await expect(page.getByRole("link", { name: "Find us on Google Maps" })).toHaveAttribute("href", /google\.com\/maps/);
  await page.getByRole("link", { name: "Open the service-area map" }).click();
  await expect(page).toHaveURL(/\/#coverage$/);
});

test("contact layout fits all screen sizes", async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await expect
      .poll(() => page.locator(".ct-number").evaluate((el) => el.getBoundingClientRect().right <= innerWidth + 1))
      .toBe(true);
  }
});

test("contact passes accessibility checks", async ({ page }) => {
  await page.getByRole("button", { name: /Do you provide service outside Prince George/ }).click();
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(result.violations).toEqual([]);
});

test("contact motion keeps the page usable and error free", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/contact/#questions");
  await page.reload();
  await expect(page.locator("#questions-heading")).toBeInViewport();
  const title = await page.locator("#questions-heading").boundingBox();
  const header = await page.locator(".site-header").boundingBox();
  expect(title.y).toBeGreaterThanOrEqual(Math.min(0, header.y + header.height));

  await page.getByRole("button", { name: /roadside assistance or a tow/ }).click();
  await expect(page.getByText("determine whether a roadside solution or vehicle transport", { exact: false })).toBeVisible();

  // After its entrance, the clock ring hands back to the live time.
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect
    .poll(() => page.locator(".ct-dial-arc").evaluate((node) => node.style.strokeDashoffset), { timeout: 8000 })
    .toBe("");

  // The stacking cards stay reachable in reading order.
  await page.locator(".ct-cards").scrollIntoViewIfNeeded();
  await page.getByRole("heading", { name: "Where it needs to go", exact: true }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "Where it needs to go", exact: true })).toBeInViewport();
  expect(errors).toEqual([]);
});
