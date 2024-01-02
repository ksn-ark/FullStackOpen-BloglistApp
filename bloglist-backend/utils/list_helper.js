const dummy = (blogs) => {
  return blogs ? 1 : 1
}

const totalLikes = (blogs) => {
  return blogs ? blogs.reduce((x, blog) => x + blog.likes, 0) : 0
}

const favoriteBlog = (blogs) => {
  if (!blogs[0]) {
    return null
  }

  return blogs
    .reduce((x, blog) => {
      return x.likes > blog.likes
        ? x
        : { title: blog.title, author: blog.author, likes: blog.likes }
    }, { likes: 0 })

}
const mostBlogs = (blogs) => {
  if (!blogs[0]) {
    return null
  }

  return blogs
    .reduce((x, b) => {
      const auth = x.find((blog) => blog.author === b.author)
      auth ? (auth.blogs += 1) : x.push({ author: b.author, blogs: 1 })
      return x
    }, [])
    .reduce((x, auth) => x.blogs > auth.blogs ? x : auth, { author: '', blogs: 0 })
}

const mostLikes = (blogs) => {
  if (!blogs[0]) {
    return null
  }
  return blogs
    .reduce((x, b) => {
      const auth = x.find((blog) => blog.author === b.author)
      auth ? (auth.likes += b.likes) : x.push({ author: b.author, likes: b.likes })
      return x
    }, [])
    .reduce((x, auth) => x.likes > auth.likes ? x : auth, { author: '', likes: 0 })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}