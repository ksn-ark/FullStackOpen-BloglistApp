const dummy = (blogs) => {
  return blogs ? 1 : 1
}

const totalLikes = (blogs) => {
  return blogs ? blogs.reduce((x, blog) => x + blog.likes, 0) : 0
}

const favoriteBlog = (blogs) =>
  blogs[0]
    ?
    blogs.reduce((x, blog) => (x.likes > blog.likes ? x : blog), { likes: 0 })
    : null

const mostBlogs = (blogs) =>
  blogs[0]
    ?
    blogs
      .reduce((x, b) => {
        const auth = x.find((blog) => blog.author === b.author)
        auth ? (auth.blogs += 1) : x.push({ author: b.author, blogs: 1 })
        return x
      }, [])
      .reduce((x, auth) => x.blogs > auth.blogs ? x : auth, { author: '', blogs: 0 })
    : null

const mostLikes = (blogs) =>
  blogs[0]
    ?
    blogs
      .reduce((x, b) => {
        const auth = x.find((blog) => blog.author === b.author)
        auth ? (auth.likes += b.likes) : x.push({ author: b.author, likes: b.likes })
        return x
      }, [])
      .reduce((x, auth) => x.likes > auth.likes ? x : auth, { author: '', likes: 0 })
    : null

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}