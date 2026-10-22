import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

const LoginForm = ({
  handleLogin,
  username,
  password,
  setUsername,
  setPassword,
}) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
        <h1>log in to application</h1>
      </div>
      <Stack spacing={2}>
        <TextField
          label='username'
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <TextField
          label='password'
          type='password'
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <Button type='submit' variant='contained'>
          Login
        </Button>
      </Stack>
    </form>
  )
}

export default LoginForm