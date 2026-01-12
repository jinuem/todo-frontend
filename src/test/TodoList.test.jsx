import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TodoList from '../TodoList'

describe('TodoList', () => {
  const mockTodos = [
    { id: '1', title: 'First todo', completed: false },
    { id: '2', title: 'Second todo', completed: true }
  ]

  it('renders empty state when no todos', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(<TodoList todos={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument()
  })

  it('renders todo items when todos exist', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    expect(screen.getByText('First todo')).toBeInTheDocument()
    expect(screen.getByText('Second todo')).toBeInTheDocument()
  })

  it('renders correct number of todo items', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    const todoItems = screen.getAllByRole('checkbox')
    expect(todoItems).toHaveLength(2)
  })
})
