const Blog = require('../models/blog')
const User = require('../models/user')

const initialUser = {
  _id: '6596ef028df446f41750eecd',
  username: 'root',
  name: 'groot',
  password: 'reallycoolpassword',
  blogs: [],
}

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'cool',
    author: 'nice',
    url: 'funny',
    likes: 123,
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}
const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = {
  initialUser,
  initialBlogs,
  nonExistingId,
  usersInDb,
  blogsInDb,
}
