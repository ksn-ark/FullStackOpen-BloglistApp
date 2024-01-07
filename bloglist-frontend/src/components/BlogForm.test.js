import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  const mockHandler = jest.fn()
  const user = userEvent.setup()

  const newBlog = {
    title: 'Component testing is done with react-testing-library',
    author: 'nice',
    url: 'nice.com',
  }

  test('calls function', async () => {
    render(<BlogForm handleCreateBlog={mockHandler} />)
    const titleInput = screen.getByPlaceholderText('enter title here')
    const authorInput = screen.getByPlaceholderText('enter author here')
    const urlInput = screen.getByPlaceholderText('enter url here')
    const submitButton = screen.getByText('create')

    await user.type(titleInput, newBlog.title)
    await user.type(authorInput, newBlog.author)
    await user.type(urlInput, newBlog.url)
    await user.click(submitButton)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0]).toStrictEqual(newBlog)
  })
})
