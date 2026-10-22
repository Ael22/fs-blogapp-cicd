const usersRouter = require('express').Router()
const User = require('../models/user')

const bcrypt = require('bcryptjs')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({});
  res.json(users);
})

usersRouter.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body;
    if (!username || !name || !password) {
      res.status(400).json({
        error: 'missing fields'
      })
      return;
    }

    // check if min length reached for password & username
    if (username.length < 3 || password.length < 3) {
      res.status(400).json({
        error: 'username or password too short'
      })
      return;
    }


    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const userToAdd = new User({
      username: username,
      name: name,
      password: hash
    })

    const addedUser = await userToAdd.save()
    res.status(201).json(addedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter;