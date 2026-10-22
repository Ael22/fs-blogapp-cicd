const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  try {

    const user = request.user;

    if (!user) {
      return response.status(400).json({ error: 'UserId missing or not valid  ' })
    }

    const blog = new Blog({
      ...request.body,
      user: user._id
    })

    const savedBlog = await blog.save()
    await savedBlog.populate('user', { username: 1, name: 1 })
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', userExtractor, async (req, res, next) => {
  try {
    const user = req.user;

    const id = req.params.id;

    const blogToDelete = await Blog.findById(id).populate('user')
    if (!blogToDelete) {
      return res.status(204).end()
    }

    if (blogToDelete.user._id.toString() !== user.id) {
      return res.status(401).json({ error: 'Invalid User' })
    }

    await blogToDelete.deleteOne()
    res.status(204).end()
    return
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(id, body, { returnDocument: 'after' });
    await updatedBlog.populate('user', { username: 1, name: 1 })

    res.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter