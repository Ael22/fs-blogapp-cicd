import { useState } from 'react'
import { TextField, Button, Stack } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        <h1>create new</h1>
      </div>
      <Stack spacing={2}>
        <TextField
          label='title'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        <TextField
          label='author'
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
        <TextField
          label='url'
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
        <Button type="submit" variant="contained">
          Create
        </Button>
      </Stack>
    </form>
  )
}

export default BlogForm