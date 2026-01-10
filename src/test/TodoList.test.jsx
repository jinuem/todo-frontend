import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import TodoList from '../TodoList'

describe('TodoList', () => {
  const mockTodos = [
    { id: '1', title: 'Todo 1', completed: false },
    { id: '2', title: 'Todo 2', completed: true }
  ]

  test('renders empty state when no todos', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(
      <TodoList 
        todos={[]} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    )
    
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument()
  })

  test('renders list of todos', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(
      <TodoList 
        todos={mockTodos} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    )
    
    expect(screen.getByText('Todo 1')).toBeInTheDocument()
    expect(screen.getByText('Todo 2')).toBeInTheDocument()
  })
})
