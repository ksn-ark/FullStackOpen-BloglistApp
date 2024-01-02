const dummy = (blogs) => { return blogs ? 1 : 1 }

const totalLikes = (blogs) => { return blogs ? blogs.reduce((x, blog) => x + blog.likes, 0) : 0 }

const favoriteBlog = (blogs) => {
  return blogs[0] ? blogs.reduce((x, blog) => x = x.likes > blog.likes ? x : blog, { likes: 0 }) : null
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}