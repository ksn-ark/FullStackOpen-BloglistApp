import { useState, useEffect, useRef } from 'react'

import Notification from './components/Notification'
import Blog from './components/Blog'

import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [user, setUser] = useState(null)

  const [errorMessage, setErrorMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  //useEffect
  useEffect(() => {
    async function fetchBlogs() {
      const blogs = await blogService.getAll()
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  //useRef
  const blogFormRef = useRef()

  //eventHandlers
  const handleLogin = async (user) => {
    try {
      const loggedInUser = await loginService.login(user)
      window.localStorage.setItem(
        'loggedNoteappUser',
        JSON.stringify(loggedInUser)
      )
      blogService.setToken(loggedInUser.token)
      setUser(loggedInUser)
      return
    } catch (error) {
      setIsError(true)
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
        setIsError(false)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }

  const handleCreateBlog = async (newBlog) => {
    try {
      const response = await blogService.create(newBlog)
      blogFormRef.current.toggleVisibility()
      const updatedBlogs = blogs
        .concat(response)
        .sort((a, b) => b.likes - a.likes)
      setBlogs(updatedBlogs)
      setErrorMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.error === 'token expired'
      ) {
        setIsError(true)
        setErrorMessage('session has expired login again')
        setUser(null)
        setTimeout(() => {
          setErrorMessage(null)
          setIsError(false)
        }, 5000)
      } else {
        console.log(error)
      }
    }
  }

  const handleRemoveBlog = async (id) => {
    try {
      await blogService.remove(id)
      const updatedBlogs = blogs.filter((blog) => blog.id !== id)
      setBlogs(updatedBlogs)
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.error === 'token expired'
      ) {
        setIsError(true)
        setErrorMessage('session has expired login again')
        setUser(null)
        setTimeout(() => {
          setErrorMessage(null)
          setIsError(false)
        }, 5000)
      } else {
        console.log(error)
      }
    }
  }

  const handleUpdateBlog = async (modifiedBlog, id) => {
    try {
      const response = await blogService.update(modifiedBlog, id)
      const updatedBlogs = blogs
        .map((blog) => (blog.id === response.id ? response : blog))
        .sort((a, b) => b.likes - a.likes)
      setBlogs(updatedBlogs)
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.error === 'token expired'
      ) {
        setIsError(true)
        setErrorMessage('session has expired login again')
        setUser(null)
        setTimeout(() => {
          setErrorMessage(null)
          setIsError(false)
        }, 5000)
      } else {
        console.log(error)
      }
    }
  }

  //return
  if (user === null) {
    return (
      <LoginForm handleLogin={handleLogin}>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} isError={isError} />
      </LoginForm>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} isError={isError} />
      {user.name} logged in{' '}
      <button type="logout" onClick={handleLogout}>
        logout
      </button>
      <Togglable
        showButtonLabel="new blog"
        hideButtonLabel="cancel"
        ref={blogFormRef}
      >
        <BlogForm handleCreateBlog={handleCreateBlog}>
          <h2>create new</h2>
        </BlogForm>
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          handleUpdateBlog={handleUpdateBlog}
          handleRemoveBlog={handleRemoveBlog}
        />
      ))}
    </div>
  )
}

export default App
