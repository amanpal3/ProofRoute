import { test, expect } from '@playwright/test';

test.describe('ProofRoute End-to-End User Journey', () => {
  test('1. Landing Page renders and allows navigation to verifier', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ProofRoute/i);
    await expect(page.locator('h1')).toContainText(/Cryptographic Certainty/i);

    // Verify presence of CTA
    const verifyCta = page.getByRole('link', { name: /Verify Document Now/i });
    await expect(verifyCta).toBeVisible();
    await verifyCta.click();
    await expect(page).toHaveURL(/.*\/verify/);
  });

  test('2. Public Verifier performs product lookup and checks provenance', async ({ page }) => {
    await page.goto('/verify');
    await expect(page.locator('h1')).toContainText(/Public Document Verifier/i);

    // Search for showcase product PR-8829-X
    const searchInput = page.getByPlaceholder(/search by Product ID/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill('PR-8829-X');
    await searchInput.press('Enter');

    // Should display verification result card
    await expect(page.getByText(/Cryptographic Match Verified/i)).toBeVisible();
    await expect(page.getByText(/PR-8829-X/i)).toBeVisible();
  });

  test('3. Detailed Product Provenance Page renders timeline and QR modal', async ({ page }) => {
    await page.goto('/verify/PR-8829-X');
    await expect(page.getByText(/PR-8829-X/i).first()).toBeVisible();

    // Verify shipment timeline
    await expect(page.getByText(/Shipment Custody Timeline/i)).toBeVisible();

    // Open QR Code modal
    const qrBtn = page.getByRole('button', { name: /Show QR Code/i });
    await expect(qrBtn).toBeVisible();
    await qrBtn.click();

    await expect(page.getByText(/Public Verification QR/i)).toBeVisible();
    await expect(page.getByText(/No wallet or app required/i)).toBeVisible();
  });

  test('4. Issuer Portal allows batch registration flow', async ({ page }) => {
    await page.goto('/issuer');
    await expect(page.locator('h1')).toContainText(/Issuer Batch Registration Portal/i);

    // Ensure form fields exist
    await expect(page.getByLabel(/Product ID/i).or(page.getByPlaceholder(/PR-/i))).toBeVisible();
    await expect(page.getByRole('button', { name: /Commit Batch Proof/i })).toBeVisible();
  });

  test('5. Logistics Portal displays checkpoint updating interface', async ({ page }) => {
    await page.goto('/logistics');
    await expect(page.locator('h1')).toContainText(/Logistics & Custody Tracker/i);
    await expect(page.getByRole('button', { name: /Record Custody Checkpoint/i })).toBeVisible();
  });

  test('6. Forensics Inspector loads interactive tamper heatmap', async ({ page }) => {
    await page.goto('/forensics');
    await expect(page.locator('h1')).toContainText(/AI Document Forensics/i);
    await expect(page.getByText(/Error Level Analysis/i).first()).toBeVisible();

    // Switch to authentic Pune MedTech
    const authenticBtn = page.getByRole('button', { name: /Pune MedTech/i });
    await expect(authenticBtn).toBeVisible();
    await authenticBtn.click();
    await expect(page.getByText(/PR-IND-1001/i).first()).toBeVisible();
  });
});
