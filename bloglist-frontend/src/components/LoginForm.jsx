const LoginForm = ({
  handleLogin,
  username,
  password,
  setUsername,
  setPassword,
  children,
}) => {
  return (
    <div>
      {children}
      <form onSubmit={handleLogin}>
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
