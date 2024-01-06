import { useState } from "react";
const LoginForm = ({ handleLogin, children }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const doLogin = (event) => {
    event.preventDefault();
    handleLogin({
      username: username,
      password: password,
    });
  };

  return (
    <div>
      {children}
      <form onSubmit={doLogin}>
        <div>
          username{"  "}
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
          <div>
            passsword{"  "}
            <input
              type="text"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
