import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('should render login UI correctly', async ({ page }) => {
    await page.goto('/auth/login');

    await expect(page.getByText('SummAid')).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
    await expect(page.getByText(/Sign in to continue your learning journey/i)).toBeVisible();
  });

  test('should trigger Google login when button is clicked', async ({ page }) => {
    await page.goto('/auth/login');

    const loginButton = page.getByRole('button', { name: /Continue with Google/i });

    await loginButton.click();
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    expect(page.url()).toContain('/dashboard');
  });
});