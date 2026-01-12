import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TodoItem from '../TodoItem'

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    title: 'Test todo',
    completed: false
  }

  it('renders todo title and controls', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    expect(screen.getByText('Test todo')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('shows completed state correctly', () => {
    const completedTodo = { ...mockTodo, completed: true }
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('calls onToggle when checkbox is clicked', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    
    expect(mockOnToggle).toHaveBeenCalledWith('1', true)
  })

  it('calls onDelete when delete button is clicked', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)
    
    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })
})
