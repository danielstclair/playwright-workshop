import { test as base, expect } from '@playwright/test'

class HomePage {
  constructor(public page: any) {}
  signIn = async () => {
    this.page.goto('/')
    const signInButton = this.page.getByRole('button', { name: 'Sign In' })
    await signInButton.click()
    await this.page.waitForTimeout(1000)
  }
}

const test = base.extend<{ homePage: HomePage }>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },
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
  test('shows user information when logged in', async ({ page, homePage }) => {
    await homePage.signIn()
    await expect(page.getByTestId('company')).toBeVisible()
    await expect(page.getByTestId('position')).toBeVisible()
    const coworkersList = page.getByTestId('coworkers-list')
    await expect(coworkersList).toBeVisible()
    await expect(coworkersList.getByText('Dwight Schrute')).toBeVisible()
  })
  test('can logout', async ({ page, homePage }) => {
    await homePage.signIn()
    await expect(page.getByTestId('company')).toBeVisible()
    await expect(page.getByTestId('position')).toBeVisible()
    const signOutButton = page.getByRole('button', { name: 'Sign Out' })
    await signOutButton.click()
    await expect(page.getByText('Welcome, please sign in.')).toBeVisible({ timeout: 10000 })
  })
})
