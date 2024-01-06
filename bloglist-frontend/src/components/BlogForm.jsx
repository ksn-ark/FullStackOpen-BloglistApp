const BlogForm = ({
  handleCreateBlog,
  title,
  author,
  url,
  setTitle,
  setAuthor,
  setUrl,
  children,
}) => {
  return (
    <div>
      {children}
      <form onSubmit={handleCreateBlog}>
        <div>
          title{"  "}
          <input
            type="text"
            name="Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author{"  "}
          <input
            type="text"
            name="Author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url{"  "}
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
  );
};

export default BlogForm;
