import { useState } from 'react'
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material'
import blogService from '../services/blogs'

const Blog = ({ blog, handleDelete }) => {
  const [currentBlog, setCurrentBlog] = useState(blog)
  const [view, setView] = useState(false)

  const loggedUserJSON = localStorage.getItem('loggedBloglistUser')
  const loggedUser = loggedUserJSON ? JSON.parse(loggedUserJSON) : null

  const handleViewBlog = () => {
    setView(!view)
  }

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
    <Card data-testid='blog-details' sx={{ mb: 1 }}>
      <CardContent>
        <Typography variant='h6' component='span'>
          {currentBlog.title}
        </Typography>{''}
        {view ? '' : <Typography component='span' color='text.secondary'>{currentBlog.author}</Typography>}

        {view && (
          <>
            <Typography>{currentBlog.url}</Typography>
            <Typography data-testid='likes'>
              likes {currentBlog.likes}{' '}
              <Button size='small' onClick={addLike}>like</Button>
            </Typography>
            <Typography>{currentBlog.author}</Typography>
            {loggedUser && loggedUser.username === currentBlog.user.username && (
              <Button size='small' color='error' onClick={handleRemove}>delete</Button>
            )}
          </>
        )}
      </CardContent>
      <CardActions>
        <Button size='small' onClick={handleViewBlog}>
          {view ? 'hide' : 'view'}
        </Button>
      </CardActions>
    </Card>
  )
}



export default Blog