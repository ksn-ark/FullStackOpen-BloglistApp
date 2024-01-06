import { useState } from "react";

const Blog = ({ blog, user, handleUpdateBlog, handleRemoveBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const [showDetails, setShowDetails] = useState(false);

  let bloglikes = blog.likes;

  const addLike = async (event) => {
    event.preventDefault();
    bloglikes += 1;
    await handleUpdateBlog(
      {
        user: blog.user.id,
        likes: bloglikes,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      },
      blog.id
    );
  };

  const removeBlog = (event) => {
    event.preventDefault();
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      handleRemoveBlog(blog.id);
    }
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{" "}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "hide" : "view"}
        </button>
      </div>
      {showDetails ? (
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes} <button onClick={addLike}>like</button>
          </p>
          <p>{blog.user.name}</p>
          {blog.user.username === user.username ? (
            <button onClick={removeBlog}>remove</button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default Blog;
