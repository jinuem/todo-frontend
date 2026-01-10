import React from 'react'

function TodoItem({ todo, onToggle, onDelete }) {
  const handleToggle = () => {
    onToggle(todo.id, !todo.completed)
  }

  const handleDelete = () => {
    onDelete(todo.id)
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
      />
      <span>{todo.title}</span>
      <button onClick={handleDelete}>Delete</button>
    </li>
  )
}

export default TodoItem
