import { Alert } from '@mui/material'

const Notification = ({ message, color }) => {
  if (message === null) {
    return null
  }

  return (
    <Alert className="success" severity={color}>
      {message}
    </Alert>
  )
}

export default Notification