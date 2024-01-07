const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }

  const errorStyle = {
    color: 'red',
  }

  if (isError) {
    return (
      <div className="notification" style={errorStyle}>
        {message}
      </div>
    )
  }
  return <div className="notification">{message}</div>
}

export default Notification
