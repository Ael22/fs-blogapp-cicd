import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, Typography, Button, Stack } from '@mui/material'
import blogService from '../services/blogs'
import { grey } from '@mui/material/colors'

const BlogDetails = ({ blog, handleDelete }) => {
  if (!blog) {
    return (
      <div>
        loading...
      </div>
    )
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [currentBlog, setCurrentBlog] = useState(blog)

  const loggedUserJSON = localStorage.getItem('loggedBloglistUser')
  const loggedUser = loggedUserJSON ? JSON.parse(loggedUserJSON) : null

  const addLike = async (event) => {
    event.preventDefault()
    const newObject = {
      ...currentBlog,
      likes: currentBlog.likes + 1,
      user: currentBlog.user.id
    }
    const updatedBlog = await blogService.increaseLike(newObject)
    setCurrentBlog(updatedBlog)
  }

  const handleRemove = async (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${currentBlog.title} by ${currentBlog.author}`)) {
      await blogService.deleteBlog(currentBlog.id)
      handleDelete(currentBlog.id)
    } else {
      return
    }
  }

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {currentBlog.title}
        </Typography>
        <Typography sx={{ color: grey[700] }}>
          by {currentBlog.author}
        </Typography>

        <Typography>
          <Link to={currentBlog.url}>{currentBlog.url}</Link>
        </Typography>

        <Typography sx={{ mb: 1 }}>
          added by {currentBlog.user.name}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ my: 1 }}>
          <Typography>{currentBlog.likes} likes</Typography>
          {loggedUser && (
            <Button size="small" variant='outlined' onClick={addLike}>like</Button>
          )}
          {loggedUser && loggedUser.username === currentBlog.user.username && (
            <Button size="small" variant='outlined' color="error" onClick={handleRemove}>delete</Button>
          )}
        </Stack>

      </CardContent>
    </Card>
  )
}

export default BlogDetails