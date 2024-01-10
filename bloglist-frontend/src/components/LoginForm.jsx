import { useState } from 'react'

const LoginForm = ({ handleLogin, children }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const doLogin = async (event) => {
    event.preventDefault()
    await handleLogin({
      username: username,
      password: password,
    })
  }

  return (
    <div>
      {children}
      <form onSubmit={doLogin} className="login-form">
        <div>
          username{'  '}
          <input
            type="text"
            value={username}
            id="username"
            onChange={({ target }) => setUsername(target.value)}
          />
          <div>
            passsword{'  '}
            <input
              type="text"
              value={password}
              id="password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login-button" type="submit">
            login
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
