import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TodoInput from '../TodoInput'

describe('TodoInput', () => {
  it('renders input field and button', () => {
    const mockOnAdd = vi.fn()
    render(<TodoInput onAdd={mockOnAdd} />)
    
    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument()
    expect(screen.getByText('Add')).toBeInTheDocument()
  })

  it('calls onAdd with input value when form is submitted', () => {
    const mockOnAdd = vi.fn()
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('Add a new todo...')
    const button = screen.getByText('Add')
    
    fireEvent.change(input, { target: { value: 'New todo' } })
    fireEvent.click(button)
    
    expect(mockOnAdd).toHaveBeenCalledWith('New todo')
  })

  it('does not call onAdd with empty input', () => {
    const mockOnAdd = vi.fn()
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const button = screen.getByText('Add')
    fireEvent.click(button)
    
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  it('clears input after submission', () => {
    const mockOnAdd = vi.fn()
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('Add a new todo...')
    
    fireEvent.change(input, { target: { value: 'New todo' } })
    fireEvent.submit(input.closest('form'))
    
    expect(input.value).toBe('')
  })
})
