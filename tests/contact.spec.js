import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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

test("contact loads directly, reloads, and connects to navigation and footer", async ({
  page,
  isMobile,
}) => {
  await expect(page).toHaveTitle("Contact | Prince George Towing");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Need a tow? Let's get you moving.",
  );
  await expect(page.locator(".ct-hero-media img")).toHaveJSProperty("naturalWidth", 1536);
  await page.reload();
  const missing = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .filter((link) => !document.getElementById(link.hash.slice(1)))
        .map((link) => link.hash),
    );
  expect(missing).toEqual([]);

  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Services" })
      .click();
  } else {
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Services" })
      .click();
  }
  await expect(page).toHaveURL(/\/services\/$/);
  await page
    .locator(".footer-links")
    .getByRole("link", { name: "Contact" })
    .click();
  await expect(page).toHaveURL(/\/contact\/$/);
  if (!isMobile)
    await expect(
      page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Contact" }),
    ).toHaveAttribute("aria-current", "page");
});

test("the dispatch dial reads the real time in Prince George", async ({
  page,
}) => {
  const digits = page.locator(".ct-dial-read .ct-dial-digits");
  await expect(digits).toHaveCount(2);
  await expect
    .poll(async () =>
      (await digits.allTextContents()).every((value) => /^\d{2}$/.test(value)),
    )
    .toBe(true);
  const [hours, minutes] = (await digits.allTextContents()).map(Number);
  expect(
    Math.abs(hours * 60 + minutes - princeGeorgeMinutes()),
  ).toBeLessThanOrEqual(1);

  // The arc reports the same instant as the digits.
  const swept = await page.locator(".ct-dial-arc").evaluate((node) => {
    const total = Number(node.getAttribute("stroke-dasharray"));
    return (
      1 -
      Number(getComputedStyle(node).strokeDashoffset.replace("px", "")) / total
    );
  });
  expect(Math.abs(swept - (hours * 60 + minutes) / 1440)).toBeLessThan(0.02);
});

test("what to have ready stays readable without motion", async ({ page }) => {
  for (const title of [
    "Where you are",
    "What you drive",
    "What happened",
    "Where it needs to go",
  ])
    await expect(
      page.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
  await expect(
    page.locator(".ct-panel-note", { hasText: "CALL 911 FIRST" }),
  ).toBeVisible();
});

test("service chooser works by keyboard and opens the matching request", async ({ page }) => {
  const roadside = page.getByRole("tab", { name: /Roadside assistance/ });
  await roadside.focus();
  await roadside.press("End");
  const heavy = page.getByRole("tab", { name: /Heavy-duty hauling/ });
  await expect(heavy).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("The right plan for the load.");
  await expect(page.locator(".ct-selector-media img")).toHaveAttribute("src", "/images/heavy-recovery.webp");
  await expect.poll(() => page.locator(".ct-selector-media img").evaluate((img) => img.naturalWidth)).toBeGreaterThan(0);
  await page.getByRole("tabpanel").getByRole("button", { name: "Request help" }).click();
  await expect(page.getByRole("radio", { name: "Heavy-duty hauling" })).toBeChecked();
});

test("questions open and close one at a time, by pointer and keyboard", async ({
  page,
}) => {
  const first = page.getByRole("button", { name: /What should I do while I wait for help/ });
  const cost = page.getByRole("button", { name: /How quickly can you reach my location/ });
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByText("move away from traffic and turn on your hazard lights", {
      exact: false,
    }),
  ).toBeVisible();

  await cost.click();
  await expect(cost).toHaveAttribute("aria-expanded", "true");
  await expect(first).toHaveAttribute("aria-expanded", "false");
  await expect(
    page.getByText("Response times depend on your location", { exact: false }),
  ).toBeVisible();

  await cost.press("Enter");
  await expect(cost).toHaveAttribute("aria-expanded", "false");
  await cost.press("Enter");
  await expect(cost).toHaveAttribute("aria-expanded", "true");
  await expect(cost).toBeFocused();
});

test("service areas are listed and reach the real map", async ({ page }) => {
  for (const name of [
    "Prince George",
    "Highway 16 West",
    "Highway 97 North",
    "Highway 97 South",
  ])
    await expect(
      page.locator(".ct-reach-name", { hasText: name }).first(),
    ).toBeVisible();
  await page.getByRole("link", { name: "Open the service-area map" }).click();
  await expect(page).toHaveURL(/\/#coverage$/);
});

test("contact layout fits all screen sizes", async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(width);
  }
});

test("contact passes accessibility checks", async ({ page }) => {
  await page.getByRole("button", { name: /Do you provide service outside Prince George/ }).click();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});

test("contact motion keeps the page usable and error free", async ({
  page,
  isMobile,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/contact/#questions");
  await expect(page.locator("#ct-faq-title")).toBeInViewport();
  const title = await page.locator("#ct-faq-title").boundingBox();
  const header = await page.locator(".site-header").boundingBox();
  expect(title.y).toBeGreaterThanOrEqual(header.y + header.height);

  await page.getByRole("button", { name: /roadside assistance or a tow/ }).click();
  await expect(
    page.getByText("determine whether a roadside solution or vehicle transport", { exact: false }),
  ).toBeVisible();

  // The checklist remains reachable in normal reading order.
  await page.locator("#before-you-call").scrollIntoViewIfNeeded();
  if (!isMobile) await page.mouse.wheel(0, 2400);
  await expect
    .poll(
      async () =>
        (await page
          .getByRole("heading", { name: "Where it needs to go", exact: true })
          .boundingBox()) !== null,
    )
    .toBe(true);
  expect(errors).toEqual([]);
});
