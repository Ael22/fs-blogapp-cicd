/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import blogService from '../services/blogs'
import { expect, vi } from 'vitest'

vi.mock('../services/blogs')

describe('<Blog />', () => {
  const blog = {
    title: 'testing title',
    author: 'testing author',
    user: 'invalid user',
    url: 'testing url',
    likes: 29
  }

  beforeEach(() => {
    render(<Blog blog={blog} />)
  })

  test('render content', () => {
    const titleElement = screen.getByText('testing title')
    const authorElement = screen.getByText('testing author')

    expect(titleElement).toBeInTheDocument()
    expect(authorElement).toBeInTheDocument()
  })

  test('renders url and likes after clicking the button', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const urlElement = screen.getByText('testing url')
    const likesElement = screen.getByText('likes 29')

    expect(urlElement).toBeInTheDocument()
    expect(likesElement).toBeInTheDocument()
  })

  test('if like button is clicked twice, event handler is called twice', async () => {

    blogService.increaseLike.mockResolvedValue({ ...blog, likes: 30 })

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(blogService.increaseLike).toHaveBeenCalledTimes(2)
  })
})