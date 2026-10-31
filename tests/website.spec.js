import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const TEL = "tel:+17782810200";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
});

test("loads the hero, services and photography without browser errors", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await expect(page).toHaveTitle(
    "Car & Heavy-Duty Towing | Prince George Towing",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Towing and heavy recovery in Prince George, BC",
  );
  await expect(page.locator(".hero-window img")).toHaveAttribute(
    "src",
    /^\/images\/home\/hero\.webp\?v=/,
  );
  const cards = page.locator("#services .svc-card");
  await expect(cards).toHaveCount(5);
  for (const id of ["towing", "heavy", "equipment", "offloading", "roadside"])
    await expect(page.locator(`#services a[href="/services/${id}/"]`)).toHaveCount(1);
  // Every photo on the page loads once it is scrolled to.
  const images = page.locator("main img:visible, footer img");
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((el) => el.complete && el.naturalWidth > 0))
      .toBe(true);
  }
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

test("every help action calls dispatch and the number is readable", async ({
  page,
}) => {
  const heroNumber = page.locator(".hero-number");
  await expect(heroNumber).toHaveAttribute("href", TEL);
  await expect(heroNumber).toHaveAccessibleName("Call 778-281-0200");
  await expect(heroNumber).toBeVisible();
  await expect(page.locator(".hero-cta")).toHaveAttribute("href", TEL);
  await expect(page.locator(".header-call")).toHaveAttribute("href", TEL);
  await expect(page.locator(".svc-call")).toHaveAttribute("href", TEL);
  await expect(page.locator(".closing-number")).toHaveAttribute("href", TEL);
  await expect(page.locator(".closing-number")).toHaveAccessibleName("Call 778-281-0200");
  await expect(page.locator(".footer-call a")).toHaveText("778-281-0200");
  const phoneLinks = await page
    .locator('a[href^="tel:"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(phoneLinks.length).toBeGreaterThanOrEqual(6);
  expect(new Set(phoneLinks)).toEqual(new Set([TEL]));
  await expect(page.locator("form")).toHaveCount(0);
});

test("hero offers a call and a way down to the services", async ({ page }) => {
  await expect(page.locator(".hero-dispatch")).toContainText("Dispatch answers 24/7");
  await expect(
    page.locator(".hero-actions").getByRole("link", { name: "See what we move" }),
  ).toHaveAttribute("href", "#services");
  // Without motion the footage layer stays out of the way.
  await expect(page.locator(".hero-film")).toBeHidden();
});

test("service cards link to their pages and the strip below calls dispatch", async ({
  page,
  isMobile,
}) => {
  const card = page.getByRole("link", { name: /Heavy-duty towing.*Buses, coaches/ });
  await expect(card).toHaveAttribute("href", "/services/heavy/");
  await expect(page.locator("main")).not.toContainText(/illustrative/i);
  await expect(page.locator(".svc-call")).toContainText("Not sure which one?");
  if (isMobile) {
    // On phones the cards swipe sideways inside their own row.
    const row = page.locator(".svc-grid");
    expect(await row.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  }
  await card.click();
  await expect(page).toHaveURL(/\/services\/heavy\/$/);
});

test("the statement reads as one heading with its photos set aside", async ({
  page,
}) => {
  const heading = page.getByRole("heading", { level: 2, name: /We tow cars/ });
  await expect(heading).toContainText("coaches");
  await expect(heading).toContainText("machinery");
  await expect(heading.locator("img")).toHaveCount(3);
  for (const image of await heading.locator("img").all())
    await expect(image).toHaveAttribute("alt", "");
});

test("heavy-duty checklist and the three steps read in order", async ({ page }) => {
  await expect(page.locator(".heavy-list li")).toHaveCount(5);
  await expect(page.locator(".heavy-list li").first()).toContainText(
    "Approximate weight and dimensions",
  );
  const steps = page.locator(".drive-step");
  await expect(steps.locator("h3")).toHaveText([
    "Tell us where you are",
    "Agree on the plan",
    "Get moving",
  ]);
  // Without motion every step is already lit.
  await expect(page.locator(".drive-step[data-reached]")).toHaveCount(3);
});

test("reviews carousel moves by button and arrow key", async ({
  page,
}) => {
  const carousel = page.getByRole("region", { name: "Customer reviews" });
  await carousel.scrollIntoViewIfNeeded();
  const quote = carousel.locator(".quote");
  const first = await quote.textContent();
  // Centre the arrows, clear of the phone call bar that slides in at the
  // bottom of the screen.
  const next = carousel.getByRole("button", { name: "Next review" });
  await next.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await next.click();
  await expect(quote).not.toHaveText(first);
  await expect(carousel.locator(".testimonial-count")).toHaveText("2 / 3");
  await carousel.getByRole("button", { name: "Next review" }).press("ArrowLeft");
  await expect(carousel.locator(".testimonial-count")).toHaveText("1 / 3");
  // Arrow keys outside the carousel are left alone.
  await page.evaluate(() => document.activeElement.blur());
  await page.keyboard.press("ArrowRight");
  await expect(carousel.locator(".testimonial-count")).toHaveText("1 / 3");
  // With reduced motion the carousel does not advance on its own.
  await page.waitForTimeout(5600);
  await expect(carousel.locator(".testimonial-count")).toHaveText("1 / 3");
});

test("service areas respond to pointer and keyboard selection", async ({
  page,
}) => {
  const tabs = page.getByRole("tablist", { name: "Service areas" });
  const panel = page.locator("#area-panel");
  await tabs.scrollIntoViewIfNeeded();
  await expect(tabs.getByRole("tab", { name: /Prince George/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(panel).toContainText("Prince George & surrounding areas");
  await tabs.getByRole("tab", { name: /Highway 16 West/ }).click();
  await expect(panel).toContainText("Heading west on the Yellowhead");
  await expect(page.locator(".route-map")).toHaveAttribute("data-active", "west");
  await tabs.getByRole("tab", { name: /Highway 16 West/ }).press("ArrowDown");
  await expect(tabs.getByRole("tab", { name: /Highway 97 North/ })).toBeFocused();
  await expect(panel).toContainText(
    "Whether you are travelling through town or heading north",
  );
  await page.keyboard.press("End");
  await expect(tabs.getByRole("tab", { name: /Highway 97 South/ })).toBeFocused();
  await expect(panel).toContainText("Travelling south on the Cariboo Highway");
  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: /Prince George/ })).toBeFocused();
  // Clicking a road on the map selects it too.
  await page.locator(".route-map .route").nth(2).locator(".road-hit").click({ force: true });
  await expect(tabs.getByRole("tab", { name: /Highway 97 South/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("questions open one at a time by pointer and keyboard", async ({ page }) => {
  const first = page.getByRole("button", {
    name: "What should I do while I wait for a tow truck?",
  });
  const cost = page.getByRole("button", { name: "How much does towing cost?" });
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await cost.click();
  await expect(cost).toHaveAttribute("aria-expanded", "true");
  await expect(first).toHaveAttribute("aria-expanded", "false");
  await expect(
    page.getByRole("region", { name: "How much does towing cost?" }),
  ).toContainText("The cost depends on factors such as your location");
  await cost.press("Enter");
  await expect(cost).toHaveAttribute("aria-expanded", "false");
  await expect(
    page.getByRole("region", { name: "How much does towing cost?" }),
  ).toHaveCount(0);
  await expect(page.locator(".safety")).toContainText("call 911 first");
});

test("fits narrow and wide screens with a working mobile menu", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const lines = [...document.querySelectorAll(".hero-line, .st-line, .closing-number")];
            return (
              document.documentElement.scrollWidth <= innerWidth &&
              lines.every((line) => line.getBoundingClientRect().right <= innerWidth + 1)
            );
          }),
        { message: `Layout and headlines fit a ${width}px viewport` },
      )
      .toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  const menu = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: /Call 778-281-0200/ })).toHaveAttribute(
    "href",
    TEL,
  );
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await menu.getByRole("link", { name: "About us" }).click();
  await expect(menu).toHaveCount(0);
  await expect(page).toHaveURL(/\/about\/$/);
});

test("phones get a call bar once the dispatch numbers scroll away", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const bar = page.locator(".call-bar");
  await expect(bar).toHaveCount(0);
  await page.locator(".heavy-list").scrollIntoViewIfNeeded();
  await expect(bar).toBeVisible();
  await expect(bar.getByRole("link")).toHaveAttribute("href", TEL);
  await page.locator(".closing-number").scrollIntoViewIfNeeded();
  await expect(bar).toHaveCount(0);
});

test("passes automated accessibility checks", async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.locator("#faq").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "How much does towing cost?" }).click();
  const open = await new AxeBuilder({ page })
    .include("#faq")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(open.violations).toEqual([]);
});

test("road frames load only when motion is welcome", async ({ page }) => {
  const frames = [];
  page.on("request", (request) => {
    if (request.url().includes("/images/road-sequence/")) frames.push(request.url());
  });
  await page.reload();
  await expect(page.locator(".hero-film")).toBeHidden();
  await page.waitForLoadState("networkidle");
  expect(frames).toEqual([]);

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.reload();
  await expect(page.locator(".hero")).toHaveClass(/is-live/);
  await expect(page.locator(".hero-sequence")).toHaveAttribute("data-ready", "");
  expect(frames[0]).toMatch(/\/road-sequence\/(960|1280)\/001\.webp$/);
});

test("with motion: the hero opens, the truck drives, the header steps aside", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator(".hero")).toHaveClass(/is-live/);
  await expect(page.locator(".hero-cta")).toBeVisible();
  await page.locator(".hero-cta").click({ trial: true });
  const header = page.locator(".site-header");

  // Scrolling through the pinned hero opens the window to the full screen,
  // drives the truck, and ends on the logo, number and contact link.
  const heroEnd = await page
    .locator(".hero-stage")
    .evaluate((el) => el.parentElement.getBoundingClientRect().bottom + scrollY - innerHeight);
  await page.evaluate((y) => window.scrollTo(0, y - 40), heroEnd);
  await expect
    .poll(() => page.locator(".hero-film").evaluate((el) => getComputedStyle(el).clipPath))
    .toMatch(/^inset\(0px\)$|^inset\(0px 0px 0px 0px\)$|^none$/);
  await expect(page.locator(".hero-card-logo")).toBeVisible();
  await expect(page.locator(".hero-card-number")).toBeVisible();
  await expect(page.locator(".hero-card-number")).toHaveAttribute("href", TEL);
  await expect(page.getByRole("link", { name: "Contact now" })).toHaveAttribute("href", "/contact/");
  // Reading downward, the header steps out of the way.
  await expect(header).toHaveAttribute("data-away", "");

  // The steps light up as the truck reaches them.
  if ((page.viewportSize()?.width ?? 0) > 900) {
    const driveEnd = await page
      .locator(".drive-stage")
      .evaluate((el) => el.parentElement.getBoundingClientRect().bottom + scrollY - innerHeight);
    await page.evaluate((y) => window.scrollTo(0, y), driveEnd);
    await expect(page.locator(".drive-step[data-reached]")).toHaveCount(3);
  }

  // Scrolling back up brings the header back.
  await page.evaluate(() => window.scrollBy(0, -300));
  await expect(header).not.toHaveAttribute("data-away", "");

  for (const id of ["#services-heading", "#heavy-heading", "#closing-heading"]) {
    const heading = page.locator(id);
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeInViewport();
    await expect
      .poll(() =>
        heading.evaluate((el) => {
          const line = el.querySelector(".reveal-line") ?? el;
          return Math.round(
            line.getBoundingClientRect().top -
              (line.parentElement ?? el).getBoundingClientRect().top,
          );
        }),
      )
      .toBeLessThanOrEqual(1);
  }
  await page.getByRole("button", { name: "How much does towing cost?" }).click();
  await expect(
    page.getByRole("region", { name: "How much does towing cost?" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: /Highway 97 North/ }).click();
  await expect(page.locator("#area-panel")).toContainText("heading north");
});
