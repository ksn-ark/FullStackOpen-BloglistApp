import { useState } from 'react'

const BlogForm = ({ handleCreateBlog, children }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    await handleCreateBlog({
      title: title,
      author: author,
      url: url,
    })
    setAuthor('')
    setTitle('')
    setUrl('')
  }
  return (
    <div>
      {children}
      <form onSubmit={addBlog}>
        <div>
          title{'  '}
          <input
            type="text"
            name="Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author{'  '}
          <input
            type="text"
            name="Author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url{'  '}
          <input
            type="text"
            name="Url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
