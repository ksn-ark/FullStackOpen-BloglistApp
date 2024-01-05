const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

let currentUser

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const saltRounds = 10

  const user = { passwordHash: '', ...helper.initialUser }

  user.passwordHash = await bcrypt.hash(user.password, saltRounds)

  delete user.password

  const userObject = new User(user)

  user.password = helper.initialUser.password

  delete user.name
  delete user.passwordHash

  await userObject.save()

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog({ user: userObject._id, ...blog })
    await blogObject.save()
  }

  const response = await api.post('/api/login').send(user)
  currentUser = await response.body
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('the unique identifier property of blogs are named id', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${currentUser.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const blogUrls = blogsAtEnd.map((blog) => blog.url.toString())

  expect(blogUrls).toContainEqual(newBlog.url.toString())
})

test('if likes is missing, defaults to 0', async () => {
  const newBlog = {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${currentUser.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
})

test('adding blog fails with 401 if no auth provided', async () => {
  const newBlog = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

  const blogUrls = blogsAtEnd.map((blog) => blog.url.toString())

  expect(blogUrls).not.toContainEqual(newBlog.url.toString())
})

test('blog without title or url is not added', async () => {
  const blogWithoutTitle = {
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  }

  const blogWithoutUrl = {
    title: 'First class tests',
    author: 'Robert C. Martin',
    likes: 10,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${currentUser.token}`)
    .send(blogWithoutTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${currentUser.token}`)
    .send(blogWithoutUrl)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('deleting blog is successful with valid id', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${currentUser.token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

  const ids = blogsAtEnd.map((r) => r.id)

  expect(ids).not.toContain(blogToDelete.id)
})

test('updating blog is successful with valid id', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const blog = {
    author: 'bro what test',
    likes: 20,
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd[0].likes).toBe(blog.likes)
  expect(blogsAtEnd[0].author).toBe(blog.author)
})

afterAll(async () => {
  await mongoose.connection.close()
})
