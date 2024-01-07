import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'

describe('<Blog />', () => {
  let container
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'nice',
    url: 'nice.com',
    likes: 20,
    user: {
      id: '12345',
      username: 'root',
      name: 'groot',
    },
  }

  const user = {
    token: '12345f',
    username: 'root',
    name: 'groot',
  }

  const mockRemoveHandler = jest.fn()
  const mockUpdateHandler = jest.fn()

  beforeEach(() => {
    container = render(
      <Blog
        user={user}
        blog={blog}
        handleRemoveBlog={mockRemoveHandler}
        handleUpdateBlog={mockUpdateHandler}
      />
    ).container
  })

  test('only shows title and author at start, details div is null and blogDiv does not have url or likes', () => {
    const blogDiv = container.querySelector('.blog')
    expect(blogDiv).toHaveTextContent(`${blog.title} ${blog.author}`)
    const blogDetailsDiv = container.querySelector('.blog-details')
    expect(blogDetailsDiv).toBeNull()
    expect(blogDiv).not.toHaveTextContent(`${blog.url}`, { exact: false })
    expect(blogDiv).not.toHaveTextContent(`${blog.likes}`, { exact: false })
  })

  test('after clicking view button, url and likes are shown in the blog-details div', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.blog-details')
    expect(div).not.toBeNull()
    expect(div).toHaveTextContent(`${blog.url}`, { exact: false })
    expect(div).toHaveTextContent(`${blog.likes}`, { exact: false })
  })

  test('clicking the button calls event handler once', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockUpdateHandler.mock.calls).toHaveLength(2)
  })
})
