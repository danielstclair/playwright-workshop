import { test, expect } from '@playwright/test'

test('has a title', async ({ page }) => {
  await page.goto('/')
  // check if page has a title

  await expect(page).toHaveTitle(/Create Next App/);
})

test.describe('Home page', () => {
  test('does not show user information when not logged in', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Welcome, please sign in.')).toBeVisible({ timeout: 10000 })
    await expect(page.getByTestId('company')).not.toBeVisible()
    await expect(page.getByTestId('position')).not.toBeVisible()
    await expect(page.getByTestId('coworkers-section')).not.toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })
  test('shows user information when logged in', async ({ page }) => {
    await page.goto('/')
    const signInButton = page.getByRole('button', { name: 'Sign In' })
    await signInButton.click()
    await page.waitForTimeout(1000)
    await expect(page.getByTestId('company')).toBeVisible()
    await expect(page.getByTestId('position')).toBeVisible()
    const coworkersList = page.getByTestId('coworkers-list')
    await expect(coworkersList).toBeVisible()
    await expect(coworkersList.getByText('Dwight Schrute')).toBeVisible()
  })
  test('can logout', async ({ page }) => {
    await page.goto('/')
    const signInButton = page.getByRole('button', { name: 'Sign In' })
    await signInButton.click()
    await page.waitForTimeout(1000)
    await expect(page.getByTestId('company')).toBeVisible()
    await expect(page.getByTestId('position')).toBeVisible()
    const signOutButton = page.getByRole('button', { name: 'Sign Out' })
    await signOutButton.click()
    await expect(page.getByText('Welcome, please sign in.')).toBeVisible({ timeout: 10000 })
  })
})
