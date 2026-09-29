import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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
  await expect(page).toHaveTitle(
    "Towing & Roadside Services | Prince George Towing",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Towing &roadside solutions.",
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
    .getByRole("link", { name: "Prince George Towing, home", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "STUCK ON",
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
  await page
    .locator(".footer-links")
    .getByRole("link", { name: "About us" })
    .click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "The help you need when things stop moving",
  );
  expect(errors).toEqual([]);
});

test("each service request opens with the right selection and restores focus", async ({
  page,
}) => {
  for (const [id, action, service] of [
    ["towing", "Get towing help", "Towing & recovery"],
    ["roadside", "Get roadside help", "Roadside assistance"],
    ["heavy", "Get heavy-duty help", "Heavy-duty hauling"],
  ]) {
    const button = page
      .locator(`#${id}`)
      .getByRole("button", { name: action, exact: true });
    await button.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("radio", { name: service })).toBeChecked();
    await dialog.getByRole("button", { name: "Close dialog" }).click();
    await expect(button).toBeFocused();
  }
});

test("service finder supports keyboard choice, matching details, and requests", async ({
  page,
}) => {
  await page.getByRole("link", { name: "Explore our services" }).click();
  await expect(page.locator("#our-services")).toBeInViewport();
  await page.locator("#service-finder").scrollIntoViewIfNeeded();
  const tabs = page.getByRole("tablist", {
    name: "Choose your vehicle situation",
  });
  const first = tabs.getByRole("tab", { name: "My vehicle won’t start" });
  await first.click();
  await first.press("End");
  const last = tabs.getByRole("tab", {
    name: "It’s a truck, RV, or equipment",
  });
  await expect(last).toBeFocused();
  const panel = page.getByRole("tabpanel");
  await expect(panel).toContainText("Plan a heavy-duty move.");
  await panel.getByRole("button", { name: "Arrange heavy-duty help" }).click();
  await expect(
    page.getByRole("dialog").getByRole("radio", { name: "Heavy-duty hauling" }),
  ).toBeChecked();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await panel.getByRole("link", { name: "See service details" }).click();
  await expect(page).toHaveURL(/\/services\/heavy\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Heavy-duty hauling.");
  await page.goto("/services/");
  await first.click();
  await first.press("ArrowDown");
  await expect(
    tabs.getByRole("tab", { name: "Flat tire, lockout, or fuel" }),
  ).toBeFocused();
  await expect(panel).toContainText("Help at roadside.");
});

test("preparation details and questions work with keyboard and pass accessibility checks", async ({
  page,
}) => {
  const preparation = page.locator("#towing .svc-preparation summary");
  await preparation.focus();
  await preparation.press("Enter");
  await expect(page.locator("#towing .svc-preparation")).toHaveAttribute(
    "open",
    "",
  );
  await expect(page.locator("#towing .svc-preparation p")).toContainText(
    "destination information",
  );
  const question = page
    .locator(".svc-faq-list summary")
    .filter({ hasText: "What is this going to cost me?" });
  await question.click();
  await expect(page.locator(".svc-faq-list details[open] p")).toContainText(
    "The cost depends on the service required",
  );
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("service capabilities expand with keyboard and preserve the requested service", async ({
  page,
}) => {
  const capability = page
    .locator("#towing .svc-capabilities details")
    .filter({ hasText: "Flatbed transport" });
  await capability.locator("summary").focus();
  await capability.locator("summary").press("Enter");
  await expect(capability).toHaveAttribute("open", "");
  await expect(capability.locator("p")).toBeVisible();
  await expect(capability.locator("p")).toContainText("secure transportation");
  await capability.locator("summary").press("Enter");
  await expect(capability).not.toHaveAttribute("open", "");
});

test("recovery walkthrough connects buttons, keyboard slider, illustration, and help", async ({
  page,
}) => {
  const walkthrough = page.locator(".recovery-walkthrough");
  const steps = page.getByRole("group", {
    name: "Explore the recovery process",
  });
  const slider = page.getByRole("slider", {
    name: "Recovery walkthrough step",
  });
  await steps.getByRole("button", { name: "Make a plan" }).click();
  await expect(slider).toHaveValue("1");
  await expect(walkthrough.locator(".recovery-step-copy")).toContainText(
    "availability, and cost",
  );
  await slider.focus();
  await slider.press("End");
  await expect(slider).toHaveValue("2");
  await expect(slider).toHaveAttribute("aria-valuetext", "Step 3: Get moving");
  await expect(
    steps.getByRole("button", { name: "Get moving" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    walkthrough.locator(".recovery-road-stop.is-reached"),
  ).toHaveCount(3);
  await expect(walkthrough.locator(".recovery-step-copy")).toContainText(
    "agreed destination",
  );
  await slider.press("Home");
  await expect(slider).toHaveValue("0");
  await expect(
    steps.getByRole("button", { name: "Tell us where" }),
  ).toHaveAttribute("aria-pressed", "true");
  const help = walkthrough.getByRole("button", {
    name: "Let’s make your plan",
  });
  await help.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(help).toBeFocused();
});

test("service photography follows scroll navigation and finder selection with motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.reload();
  const nav = page.getByRole("navigation", { name: "Service categories" });
  for (const id of ["heavy", "roadside", "towing"]) {
    await nav.locator(`a[href="#${id}"]`).click();
    await expect(page.locator(`#${id} .svc-detail-photo img`)).toBeVisible();
    await expect(page.locator(`#svc-title-${id}`)).toBeInViewport();
    await expect(nav.locator(`a[href="#${id}"]`)).toHaveAttribute(
      "aria-current",
      "location",
    );
  }
  const finder = page.locator("#service-finder");
  await finder
    .getByRole("tab", { name: "It’s a truck, RV, or equipment" })
    .click();
  await expect(finder.getByRole("tabpanel")).toHaveAttribute(
    "data-service",
    "heavy",
  );
  await expect(finder.locator(".svc-finder-photo img")).toHaveAttribute(
    "src",
    "/images/heavy-recovery.webp",
  );
  await finder.getByRole("tab", { name: "I need a vehicle moved" }).click();
  await expect(finder.getByRole("tabpanel")).toHaveAttribute(
    "data-service",
    "towing",
  );
  await expect(finder.locator(".svc-finder-photo img")).toHaveAttribute(
    "src",
    "/images/recovery-detail.webp",
  );
  await expect
    .poll(() =>
      finder
        .locator(".svc-recommendation-copy")
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBe(1);
});

test("photographic service index leads to each dedicated service page", async ({ page }) => {
  const cards = page.locator(".svc-index-card");
  await expect(cards).toHaveCount(3);
  for (const [index, id] of ["towing", "roadside", "heavy"].entries()) {
    await page.goto("/services/");
    const card = page.locator(".svc-index-card").nth(index);
    await expect(card).toHaveAttribute("href", `/services/${id}/`);
    await expect(card.locator("img")).toHaveJSProperty("naturalWidth", 1536);
    await card.click();
    await expect(page).toHaveURL(new RegExp(`/services/${id}/$`));
    await expect(page.locator(".service-detail-page h1")).toBeVisible();
  }
});

test("animated details settle cleanly and the walkthrough truck reaches its destination", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.reload();
  const detail = page.locator("#towing .svc-capabilities details").first();
  await detail.locator("summary").click();
  await expect(detail).toHaveAttribute("open", "");
  await expect.poll(() => detail.evaluate((el) => el.style.height)).toBe("");
  await detail.locator("summary").click();
  await expect(detail).not.toHaveAttribute("open", "");
  await expect.poll(() => detail.evaluate((el) => el.style.height)).toBe("");
  await page
    .getByRole("group", { name: "Explore the recovery process" })
    .getByRole("button", { name: "Get moving" })
    .click();
  await expect
    .poll(() =>
      page.locator(".recovery-truck-position").evaluate((el) => el.style.left),
    )
    .toBe("100%");
  await expect(page.locator(".recovery-step-copy")).toContainText(
    "agreed destination",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await detail.locator("summary").click();
  await expect(detail).toHaveAttribute("open", "");
  await expect(detail.locator("p")).toBeVisible();
});

test("service layouts fit mobile through desktop and photography loads", async ({
  page,
}) => {
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
      .evaluateAll((images) =>
        images.every((image) => image.complete && image.naturalWidth > 0),
      ),
  ).toBe(true);
});

test("direct service links clear the sticky navigation and work with motion enabled", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/services/#heavy");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("#svc-title-heavy")).toBeInViewport();
  await expect
    .poll(() =>
      page
        .locator("#heavy .svc-detail-copy")
        .evaluate((element) => Number(getComputedStyle(element).opacity)),
    )
    .toBe(1);
  const heading = await page.locator("#svc-title-heavy").boundingBox();
  const navigation = await page.locator(".svc-jump-nav").boundingBox();
  expect(heading.y).toBeGreaterThanOrEqual(navigation.y + navigation.height);
  await page
    .locator("#heavy")
    .getByRole("button", { name: "Get heavy-duty help" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(errors).toEqual([]);
});
