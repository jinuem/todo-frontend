import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import TodoInput from '../TodoInput'

describe('TodoInput', () => {
  test('renders input and button', () => {
    const mockOnAdd = vi.fn()
    render(<TodoInput onAdd={mockOnAdd} />)
    
    expect(screen.getByPlaceholderText('Enter a new todo...')).toBeInTheDocument()
    expect(screen.getByText('Add')).toBeInTheDocument()
  })

  test('calls onAdd when form is submitted with valid input', () => {
    const mockOnAdd = vi.fn()
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('Enter a new todo...')
    const button = screen.getByText('Add')
    
    fireEvent.change(input, { target: { value: 'Test todo' } })
    fireEvent.click(button)
    
    expect(mockOnAdd).toHaveBeenCalledWith('Test todo')
    expect(input.value).toBe('')
  })

  test('does not call onAdd with empty input', () => {
    const mockOnAdd = vi.fn()
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const button = screen.getByText('Add')
    fireEvent.click(button)
    
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  test('button is disabled when input is empty', () => {
    const mockOnAdd = vi.fn()
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const button = screen.getByText('Add')
    expect(button).toBeDisabled()
    
    const input = screen.getByPlaceholderText('Enter a new todo...')
    fireEvent.change(input, { target: { value: 'Test' } })
    expect(button).not.toBeDisabled()
  })
})
