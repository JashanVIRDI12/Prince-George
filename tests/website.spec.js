import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  // Keep UI tests deterministic and avoid repeated requests to the public tile service.
  await page.route("https://tile.openstreetmap.org/**", (route) =>
    route.fulfill({
      contentType: "image/png",
      body: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6Z9sAAAAASUVORK5CYII=",
        "base64",
      ),
    }),
  );
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
});

test("loads original imagery and page sections without browser errors", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await expect(page).toHaveTitle(
    "Prince George Towing — Stuck on the road? Call us.",
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "STUCK ON",
  );
  for (const image of await page.locator("img").all()) {
    await image.evaluate((el) =>
      el.closest("section")?.scrollIntoView({ block: "center" }),
    );
    await expect
      .poll(() => image.evaluate((el) => el.complete && el.naturalWidth > 0))
      .toBe(true);
  }
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((images) =>
          images.every((image) => image.complete && image.naturalWidth > 0),
        ),
    )
    .toBe(true);
  const missingTargets = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .filter((link) => !document.querySelector(link.getAttribute("href")))
        .map((link) => link.href),
    );
  expect(missingTargets).toEqual([]);
  expect(errors).toEqual([]);
});

test("service details lead to a validated request, editable summary and download", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Explore Roadside assistance" })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading")).toHaveText("Roadside assistance");
  await dialog
    .getByRole("button", { name: "Get help with roadside assistance" })
    .click();
  await expect(
    dialog.getByRole("radio", { name: "Roadside assistance" }),
  ).toBeChecked();
  await dialog.getByRole("button", { name: "Prepare my request" }).click();
  await expect(dialog.locator("form")).toBeVisible();
  await dialog
    .getByLabel("Your location")
    .fill("Highway 16 near Prince George");
  await dialog.getByLabel("Vehicle", { exact: false }).fill("2020 Toyota RAV4");
  await dialog.getByLabel("Destination").fill("Prince George");
  await dialog.getByLabel("Your name").fill("Alex");
  await dialog.getByLabel("Phone number").fill("not-a-number");
  expect(
    await dialog
      .getByLabel("Phone number")
      .evaluate((input) => input.checkValidity()),
  ).toBe(false);
  await dialog.getByLabel("Phone number").fill("+1 (250) 555-0123");
  expect(
    await dialog
      .getByLabel("Phone number")
      .evaluate((input) => input.checkValidity()),
  ).toBe(true);
  await dialog.getByRole("button", { name: "Prepare my request" }).click();
  await expect(dialog.getByRole("heading")).toContainText("ready.");
  await expect(dialog.locator("dl")).toContainText(
    "Highway 16 near Prince George",
  );
  await expect(dialog.locator("dl")).toContainText("Roadside assistance");
  await expect(dialog).toContainText("your request has not been sent");
  const downloadPromise = page.waitForEvent("download");
  await dialog.getByRole("button", { name: "Save details" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("prince-george-towing-request.txt");
  expect(await readFile(await download.path(), "utf8")).toContain("Alex");
  await dialog.getByRole("button", { name: "Edit my details" }).click();
  await expect(dialog.getByLabel("Your name")).toHaveValue("Alex");
  await dialog.getByRole("button", { name: "Close dialog" }).click();
  await expect(dialog).toHaveCount(0);
});

test("coverage routes respond to pointer and keyboard selection", async ({
  page,
}) => {
  await page.locator(".coverage-map").scrollIntoViewIfNeeded();
  await page
    .getByRole("button", { name: "Show Highway 97 North coverage" })
    .click();
  await expect(
    page.getByRole("tab", { name: "Highway 97 North" }),
  ).toHaveAttribute("aria-selected", "true");
  await page.getByRole("tab", { name: "Highway 16 West" }).click();
  await expect(page.locator("#coverage").getByRole("tabpanel")).toContainText(
    "Heading west on the Yellowhead",
  );
  await page.getByRole("tab", { name: "Highway 16 West" }).press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Highway 97 North" }),
  ).toBeFocused();
  await expect(page.locator("#coverage").getByRole("tabpanel")).toContainText(
    "Whether you are travelling through town or heading north",
  );
  await page.getByRole("tab", { name: "Highway 97 North" }).press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Highway 97 South" }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#coverage").getByRole("tabpanel")).toContainText(
    "Travelling south on the Cariboo Highway",
  );
});

test("field notes show answers and dialog closes with focus restored", async ({
  page,
}) => {
  const question = page.getByRole("button", {
    name: "How much does towing cost?",
  });
  await question.click();
  await expect(question).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#field-answer")).toContainText(
    "The cost depends on factors such as your location",
  );
  const opener = page.locator(".header-help");
  await opener.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test("fits narrow and wide screens with a working mobile menu", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(
        () =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        { message: `Layout fits a ${width}px viewport` },
      )
      .toBe(true);
    await expect
      .poll(() =>
        page
          .locator(".hero-title")
          .evaluate((el) => el.getBoundingClientRect().right),
      )
      .toBeLessThanOrEqual(width);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "About us" })
    .click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
  await expect(page).toHaveURL(/\/about\/$/);
});

test("passes automated accessibility checks on page and request form", async ({
  page,
}) => {
  await page.evaluate(() => document.fonts.ready);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.locator(".header-help").click();
  const modalResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(modalResults.violations).toEqual([]);
});

test("location permission adds usable coordinates to the request", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["geolocation"]);
  await context.setGeolocation({ latitude: 53.9171, longitude: -122.7497 });
  await page.locator(".header-help").click();
  await page.getByRole("button", { name: "Use my location" }).click();
  await expect(
    page.getByRole("dialog").getByLabel("Your location"),
  ).toHaveValue("53.91710, -122.74970");
});

test("animated entrance and section transitions keep controls usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect
    .poll(() =>
      page
        .locator(".hero-bottom-content")
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBe(1);
  await expect(page.locator(".hero-cta")).toBeVisible();
  await page.locator(".service-lab").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator(".lab-heading h2")
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBe(1);
  await page
    .getByRole("button", { name: "Explore Roadside assistance" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.getByRole("tab", { name: /Get moving again/ }).click();
  await expect(page.locator("#process-panel")).toContainText(
    "The right solution for your vehicle",
  );
  await expect
    .poll(() =>
      page
        .locator(".process-detail-main")
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBe(1);
  await page.locator(".contact-heading").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator(".contact-heading h2")
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBe(1);
});

test("service showcase changes images, details, and keyboard selection", async ({
  page,
}) => {
  const tabs = page.getByRole("tablist", { name: "Choose a recovery service" });
  await tabs.getByRole("tab", { name: /Heavy-duty hauling/ }).click();
  await expect(page.locator("#service-panel img")).toHaveAttribute(
    "src",
    "/images/heavy-recovery.webp",
  );
  await expect(
    page.getByRole("button", { name: "Explore Heavy-duty hauling" }),
  ).toBeVisible();
  await tabs.getByRole("tab", { name: /Heavy-duty hauling/ }).press("Home");
  await expect(
    tabs.getByRole("tab", { name: /Roadside assistance/ }),
  ).toBeFocused();
  await expect(page.locator("#service-panel img")).toHaveAttribute(
    "src",
    "/images/roadside-detail.webp",
  );
});

test("field-note search has useful answers and an honest empty state", async ({
  page,
}) => {
  await page
    .getByRole("searchbox", { name: "Search roadside questions" })
    .fill("cost");
  await expect(page.locator(".notes-questions button")).toHaveCount(1);
  await expect(page.locator("#field-answer")).toContainText(
    "How much does towing cost?",
  );
  await page
    .getByRole("searchbox", { name: "Search roadside questions" })
    .fill("zzzz-no-match");
  await expect(page.locator(".notes-empty")).toBeVisible();
  await page
    .locator("#field-answer")
    .getByRole("button", { name: "Start a conversation" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("contact desk carries the chosen service into the request", async ({
  page,
}) => {
  await page
    .getByRole("combobox", { name: "Choose help for your next move" })
    .selectOption("heavy");
  await page
    .locator(".contact-desk")
    .getByRole("button", { name: "Let’s get you moving" })
    .click();
  await expect(
    page.getByRole("dialog").getByRole("radio", { name: "Heavy-duty hauling" }),
  ).toBeChecked();
});

test("service process shows useful checklists and supports keyboard navigation", async ({
  page,
}) => {
  const tabs = page.getByRole("tablist", {
    name: "Steps to getting towing help",
  });
  const panel = page.locator("#process-panel");
  await tabs.getByRole("tab", { name: /Tell us what happened/ }).click();
  await expect(panel).toContainText("Your location and callback number");
  await tabs
    .getByRole("tab", { name: /Tell us what happened/ })
    .press("ArrowRight");
  await expect(
    tabs.getByRole("tab", { name: /Confirm the plan/ }),
  ).toBeFocused();
  await expect(panel).toContainText(
    "Pricing and any additional details before starting",
  );
  await tabs.getByRole("tab", { name: /Confirm the plan/ }).press("End");
  await expect(panel).toContainText("Transport to your chosen destination");
  await tabs.getByRole("tab", { name: /Get moving again/ }).press("Home");
  await expect(
    tabs.getByRole("tab", { name: /Tell us what happened/ }),
  ).toBeFocused();
  await panel.getByRole("button", { name: "Prepare your request" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("real map loads with attribution, area selection, zoom and reset controls", async ({
  page,
}) => {
  await page.locator(".coverage-map").scrollIntoViewIfNeeded();
  const map = page.getByRole("region", {
    name: "Interactive map of Prince George and surrounding service areas",
  });
  await expect(map).toHaveAttribute("data-map-status", "ready");
  await expect(
    map.getByRole("link", { name: "OpenStreetMap", exact: true }),
  ).toBeVisible();
  const originalScale = await page
    .locator(".leaflet-control-scale-line")
    .textContent();
  await map.getByRole("button", { name: "Zoom in" }).click();
  await expect(page.locator(".leaflet-control-scale-line")).not.toHaveText(
    originalScale,
  );
  await page
    .getByRole("button", { name: "Recenter map on Prince George", exact: true })
    .click();
  await expect(page.locator(".leaflet-control-scale-line")).toHaveText(
    originalScale,
  );
  await page.getByRole("tab", { name: "Highway 16 West" }).click();
  await expect(map).toHaveAttribute("data-area", "west");
  await expect(
    page.getByRole("button", { name: "Show Highway 16 West coverage" }),
  ).toBeInViewport();
  await expect(
    page.getByRole("link", { name: "Open larger map" }),
  ).toHaveAttribute("href", /mlat=54\.017222&mlon=-124\.0075/);
  const results = await new AxeBuilder({ page })
    .include("#coverage")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("map tile failures keep area details available and retry restores the map", async ({
  page,
}) => {
  await page.route("https://tile.openstreetmap.org/**", (route) =>
    route.abort(),
  );
  await page.locator(".coverage-map").scrollIntoViewIfNeeded();
  await expect(page.locator(".map-load-error")).toBeVisible();
  await page.getByRole("tab", { name: "Highway 97 South" }).click();
  await expect(page.locator("#territory-panel")).toContainText(
    "Toward Quesnel",
  );
  await expect(
    page.getByRole("link", { name: "Open larger map" }),
  ).toHaveAttribute("href", /mlat=52\.979722/);
  await page.unroute("https://tile.openstreetmap.org/**");
  await page.route("https://tile.openstreetmap.org/**", (route) =>
    route.fulfill({
      contentType: "image/png",
      body: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6Z9sAAAAASUVORK5CYII=",
        "base64",
      ),
    }),
  );
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(page.locator(".live-coverage-map")).toHaveAttribute(
    "data-map-status",
    "ready",
  );
  await expect(page.locator(".map-load-error")).toHaveCount(0);
  await expect(page.locator(".live-coverage-map")).toHaveAttribute(
    "data-area",
    "south",
  );
});
