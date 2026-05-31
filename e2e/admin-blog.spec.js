const { test, expect } = require('@playwright/test');
const credentials = require('../e2etestuser.json');

test.describe('Admin blog regression', () => {
  const timestamp = Date.now();
  const title = `E2E Blog ${timestamp}`;
  const updatedTitle = `${title} Updated`;
  const slug = `e2e-blog-${timestamp}`;

  test('can login, create, list, edit, and view a blog', async ({ page }) => {
    await page.goto('/admin/signin');

    await page.fill('#email', credentials.email);
    await page.fill('#password', credentials.password);
    await page.click('button:has-text("Sign in with Email")');

    await page.waitForURL('**/admin/blog', { timeout: 30000 });
    await expect(page.locator('text=Blog Management')).toBeVisible();

    await page.click('a:has-text("Create New Blog")');
    await expect(page.locator('text=Create New Blog Post')).toBeVisible();

    const publishedAt = new Date().toISOString().slice(0, 16);

    await page.fill('#title', title);
    await page.fill('#slug', slug);
    await page.fill('#excerpt', 'E2E test blog excerpt.');
    await page.fill('#body', 'This is the body of the E2E test blog post.');
    await page.fill('#author', 'E2E Tester');
    await page.fill('#tags', 'e2e,test');
    await page.fill('#publishedAt', publishedAt);
    await page.selectOption('#element', 'earth');
    await page.selectOption('#status', 'published');

    await page.click('button:has-text("Create Blog")');
    await expect(page.locator('text=Blog post created successfully!')).toBeVisible({ timeout: 30000 });
    await page.waitForURL('**/admin/blog');

    await expect(page.locator(`text=${title}`)).toBeVisible();

    const row = page.locator('tr', { hasText: title });
    await expect(row).toBeVisible();
    await row.locator('text=Edit').click();

    await expect(page.locator('text=Edit Blog Post')).toBeVisible();
    await page.fill('#title', updatedTitle);
    await page.click('button:has-text("Update Blog")');
    await expect(page.locator('text=Blog post updated successfully!')).toBeVisible({ timeout: 30000 });
    await page.waitForURL('**/admin/blog');

    await expect(page.locator(`text=${updatedTitle}`)).toBeVisible();

    await page.goto(`/blog/${slug}`);
    await expect(page.locator('h1')).toContainText(updatedTitle);
  });
});
