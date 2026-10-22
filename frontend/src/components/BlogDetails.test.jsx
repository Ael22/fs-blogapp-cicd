/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BlogDetails from './BlogDetails'

const blog = {
  id: '1',
  title: 'Breaking Bad',
  author: 'Bravo Vince',
  url: 'meth.com',
  likes: 5,
  user: { id: 'u1', username: 'johndoe89', name: 'John Doe' }
}

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>)

afterEach(() => {
  localStorage.clear()
})

test('blog info and likes visible, buttons hidden for unauthenticated user', () => {
  renderWithRouter(<BlogDetails blog={blog} handleDelete={() => { }} />)

  expect(screen.getByText('5 likes', { exact: false })).toBeDefined()
  expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
  expect(screen.queryByRole('button', { name: 'delete' })).toBeNull()
})

test('non-creator sees only like button', () => {
  const otherUser = { username: 'janedoe', name: 'Jane Doe' }
  localStorage.setItem('loggedBloglistUser', JSON.stringify(otherUser))

  renderWithRouter(<BlogDetails blog={blog} handleDelete={() => { }} />)

  expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
  expect(screen.queryByRole('button', { name: 'delete' })).toBeNull()
})

test('creator sees delete button', () => {
  const creator = { username: 'johndoe89', name: 'John Doe' }
  localStorage.setItem('loggedBloglistUser', JSON.stringify(creator))

  renderWithRouter(<BlogDetails blog={blog} handleDelete={() => { }} />)

  expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
  expect(screen.getByRole('button', { name: 'delete' })).toBeDefined()
})