import { useSelector } from 'react-redux'
import { Alert } from 'flowbite-react'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  if (notification === null) {
    return null
  }

  return (
    <Alert color={notification.status} className="mt-5">
      {notification.message}
    </Alert>
  )
}



export default Notification