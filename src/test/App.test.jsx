import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'

// Mock fetch
global.fetch = vi.fn()

describe('App', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('renders todo app title', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })
    
    render(<App />)
    expect(screen.getByText('TODO App')).toBeInTheDocument()
  })

  it('fetches todos on mount', async () => {
    const mockTodos = [
      { id: '1', title: 'Test todo', completed: false }
    ]
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTodos
    })
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('Test todo')).toBeInTheDocument()
    })
  })

  it('shows error message on fetch failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })
  })
})
