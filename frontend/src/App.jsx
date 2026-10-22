import { useState, useEffect } from 'react'
import Container from '@mui/material/Container'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import BlogDetails from './components/BlogDetails'

import { AppBar, Toolbar, Button, Box } from '@mui/material'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [color, setColor] = useState('')
  const [message, setMessage] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    })
  }, [])

  const removeBlog = (id) => {
    setBlogs(blogs.filter(b => b.id !== id))
    navigate('/')
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      navigate('/')
    } catch {
      console.log('Error logging in')
      setMessage('Wrong username or password')
      setColor('error')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        navigate('/')
        setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setColor('success')
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
      .catch(error => {
        console.log(error)
        setMessage('Error creating blog')
        setColor('error')
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
    blogService.setToken(null)
  }

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  return (
    <Container>
      <AppBar position='fixed'>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Button color='inherit' component={Link} to='/'>blogs</Button>
            <Button color='inherit' component={Link} to='/create'>new blogs</Button>
          </Box>
          {!user ?
            (
              <Button color='inherit' component={Link} to='/login'>login</Button>
            )
            :
            (
              <Button color='inherit' onClick={handleLogout}>logout</Button>
            )
          }
        </Toolbar>
      </AppBar>
      <Toolbar />

      <div>
        <div>
          <br />
          <Notification message={message} color={color} />
        </div>
        <Routes>
          <Route path='/' element={
            <BlogList
              blogs={blogs}
            />
          } />
          <Route path='/login' element={
            <LoginForm
              handleLogin={handleLogin}
              username={username}
              password={password}
              setUsername={setUsername}
              setPassword={setPassword}
            />
          } />
          <Route path='/blogs/:id' element={
            <BlogDetails
              blog={blog}
              handleDelete={removeBlog}
            />
          } />
          <Route path='/create' element={
            <BlogForm createBlog={addBlog} />
          } />
        </Routes>
      </div>
    </Container>
  )
}

export default App