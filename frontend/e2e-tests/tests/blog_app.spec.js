const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'John Doe',
        username: 'johndoe89',
        password: 'Password123!'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
  })

  describe('Login', () => {
    test('Login succeeds with the correct username/password combination', async ({ page }) => {
      await loginWith(page, 'johndoe89', 'Password123!')
      await expect(page).toHaveURL('/')
    })

    test('Login fails if the username/password is incorrect', async ({ page }) => {
      await loginWith(page, 'johndoe89', 'wrongpassword')

      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'johndoe89', 'Password123!')
      await expect(page).toHaveURL('/')
    })

    test('A logged-in user can create a blog', async ({ page }) => {
      const blog = {
        title: 'Breaking Bad',
        author: 'Bravo Vince',
        url: 'meth.com'
      }
      await createBlog(page, blog)
      await expect(page.getByText(`a new blog ${blog.title} by ${blog.author} added`)).toBeVisible()
      await expect(page).toHaveURL('/')
    })

    test('A logged-in user can like blogs', async ({ page }) => {
      const blog = {
        title: 'Breaking Bad',
        author: 'Bravo Vince',
        url: 'meth.com'
      }
      await createBlog(page, blog)
      await expect(page.getByText(`a new blog ${blog.title} by ${blog.author} added`)).toBeVisible()
      await expect(page).toHaveURL('/')

      await page.getByRole('link', { name: blog.title }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('1 likes')).toBeVisible()
    })

    test('A logged-in user can delete a blog', async ({ page }) => {
      const blog = {
        title: 'Breaking Bad',
        author: 'Bravo Vince',
        url: 'meth.com'
      }
      await createBlog(page, blog)
      await expect(page.getByText(`a new blog ${blog.title} by ${blog.author} added`)).toBeVisible()
      await expect(page).toHaveURL('/')

      await page.getByRole('link', { name: blog.title }).click()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'delete' }).click()
      await expect(page).toHaveURL('/')
      await expect(page.getByText(`${blog.title}`)).not.toBeVisible()
    })

    // test('blogs are arranged in the order to most likes first', async ({ page }) => {
    //   const blog1 = {
    //     title: 'Breaking Bad',
    //     author: 'Bravo Vince',
    //     url: 'meth.com',
    //     likes: 21
    //   }
    //   const blog2 = {
    //     title: 'Sbin',
    //     author: 'Ferrari',
    //     url: 'L.com',
    //     likes: 90
    //   }
    //   const blog3 = {
    //     title: 'hehehe',
    //     author: 'uh oh',
    //     url: 'woof',
    //     likes: 73
    //   }
    //   await createBlog(page, blog1)
    //   await page.getByText(`${blog1.title} ${blog1.author}`).waitFor()
    //   await createBlog(page, blog2)
    //   await page.getByText(`${blog2.title} ${blog2.author}`).waitFor()
    //   await createBlog(page, blog3)
    //   await page.getByText(`${blog3.title} ${blog3.author}`).waitFor()

    //   const viewButtons = await page.getByLabel('button', { name: 'view' }).all();
    //   for (const button of viewButtons) {
    //     await button.click()
    //   }

    //   const likesTexts = await page.getByTestId('likes').allTextContents()
    //   const likes = likesTexts.map(text => parseInt(text.replace('likes ', '')))
    //   const sorted = [...likes].sort((a, b) => b - a)
    //   expect(likes).toEqual(sorted)
    // })
  })
})