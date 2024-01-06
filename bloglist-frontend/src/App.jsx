import { useState, useEffect, useRef } from "react";

import Notification from "./components/Notification";
import Blog from "./components/Blog";

import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const [errorMessage, setErrorMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  //useEffect
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  //useRef
  const blogFormRef = useRef();

  //eventHandlers
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      setIsError(true);
      setErrorMessage(error.response.data.error);
      setTimeout(() => {
        setErrorMessage(null);
        setIsError(false);
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    window.localStorage.removeItem("loggedNoteappUser");
    setUser(null);
  };

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    try {
      const newBlog = {
        title: title,
        author: author,
        url: url,
      };
      const response = await blogService.create(newBlog);
      blogFormRef.current.toggleVisibility();
      setAuthor("");
      setTitle("");
      setUrl("");
      setBlogs(blogs.concat(response));
      setErrorMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  };

  if (user === null) {
    return (
      <LoginForm
        handleLogin={handleLogin}
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        errorMessage={errorMessage}
        isError={isError}
      >
        <h2>Log in to application</h2>
        <Notification message={errorMessage} isError={isError} />
      </LoginForm>
    );
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} isError={isError} />
      {user.name} logged in{" "}
      <button type="logout" onClick={handleLogout}>
        logout
      </button>
      <Togglable
        showButtonLabel="new blog"
        hideButtonLabel="cancel"
        ref={blogFormRef}
      >
        <BlogForm
          handleCreateBlog={handleCreateBlog}
          title={title}
          author={author}
          url={url}
          setTitle={setTitle}
          setAuthor={setAuthor}
          setUrl={setUrl}
        >
          <h2>create new</h2>
        </BlogForm>
      </Togglable>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
