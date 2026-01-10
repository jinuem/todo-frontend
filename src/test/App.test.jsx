import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import App from '../App'

// Mock fetch
global.fetch = vi.fn()

describe('App', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  test('loads todos on mount', async () => {
    const mockTodos = [
      { id: '1', title: 'Test todo', completed: false }
    ]
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTodos
    })

    render(<App />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Test todo')).toBeInTheDocument()
    })
    
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/todos')
  })

  test('displays error when loading fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to load todos'))

    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load todos')).toBeInTheDocument()
    })
  })

  test('adds new todo', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '1', title: 'New todo', completed: false })
      })

    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText('Enter a new todo...')
    const addButton = screen.getByText('Add')

    fireEvent.change(input, { target: { value: 'New todo' } })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText('New todo')).toBeInTheDocument()
    })

    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New todo' })
    })
  })
})
