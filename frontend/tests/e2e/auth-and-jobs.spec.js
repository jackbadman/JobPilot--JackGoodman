import { expect, test } from "@playwright/test";

function createUniqueUser() {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;

  return {
    name: `E2E User ${suffix}`,
    email: `e2e-${suffix}@example.com`,
    password: "Password123!"
  };
}

async function signUp(page, user) {
  await page.goto("/");
  await page.getByRole("link", { name: "Create account" }).click();
  await page.getByLabel("Name").fill(user.name);
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Sign up" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Application Dashboard" })).toBeVisible();
}

async function logOut(page) {
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/$/);
}

async function logIn(page, user) {
  await page.goto("/");
  await page.getByRole("link", { name: "Log in" }).click();
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test("user can sign up, log out, and log back in", async ({ page }) => {
  const user = createUniqueUser();

  await signUp(page, user);
  await logOut(page);
  await logIn(page, user);
});

test("user can create, edit, and delete a job application", async ({ page }) => {
  const user = createUniqueUser();
  const originalCompany = "Acme Ltd";
  const originalTitle = "Platform Engineer";
  const updatedTitle = "Senior Platform Engineer";

  await signUp(page, user);

  await page.getByRole("link", { name: "Create application" }).click();
  await expect(page.getByRole("heading", { name: "Create Application" })).toBeVisible();

  await page.getByLabel("Company").fill(originalCompany);
  await page.getByLabel("Job title").fill(originalTitle);
  await page.getByLabel("Location").selectOption({ label: "London" });
  await page.getByLabel("Status").selectOption({ label: "Applied" });
  await page.getByLabel("Job type").selectOption({ label: "Full-time" });
  await page.getByLabel("Work type").selectOption({ label: "Remote" });
  await page.getByLabel("Salary").fill("65000");
  await page.getByLabel("Applied date").fill("2026-03-01");
  await page.getByLabel("Closing date").fill("2026-03-31");
  await page.getByRole("button", { name: "Create application" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  const originalRow = page.locator("tbody tr").filter({ hasText: `${originalCompany}${originalTitle}` });
  await expect(originalRow).toHaveCount(1);
  await expect(originalRow).toContainText("Applied");

  await originalRow.getByRole("link", { name: "Edit" }).click();
  await expect(page.getByRole("heading", { name: "Edit Application" })).toBeVisible();

  await page.getByLabel("Job title").fill(updatedTitle);
  await page.getByLabel("Status").selectOption({ label: "Interview" });
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  const updatedRow = page.locator("tbody tr").filter({ hasText: `${originalCompany}${updatedTitle}` });
  await expect(updatedRow).toHaveCount(1);
  await expect(updatedRow).toContainText("Interview");

  page.once("dialog", dialog => dialog.accept());
  await updatedRow.getByRole("button", { name: "Delete" }).click();

  await expect(page.locator("tbody tr").filter({ hasText: updatedTitle })).toHaveCount(0);
  await expect(page.getByText("No applications yet")).toBeVisible();
});
