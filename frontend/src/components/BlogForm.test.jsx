/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'
import { describe, expect } from 'vitest'

describe('BlogForm test', () => {
  test('<BlogForm /> updates parents state and calls onSubmit', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByLabelText('title')
    const authorInput = screen.getByLabelText('author')
    const urlInput = screen.getByLabelText('url')
    const createButton = screen.getByText('Create')

    await user.type(titleInput, 'title user test')
    await user.type(authorInput, 'author user test')
    await user.type(urlInput, 'url user test')
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('title user test')
    expect(createBlog.mock.calls[0][0].author).toBe('author user test')
    expect(createBlog.mock.calls[0][0].url).toBe('url user test')
  })
})