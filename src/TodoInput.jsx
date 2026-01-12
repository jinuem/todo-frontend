import { useState } from 'react'

function TodoInput({ onAdd }) {
  const [title, setTitle] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      onAdd(title.trim())
      setTitle('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="todo-input">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new todo..."
        className="todo-input-field"
      />
      <button type="submit" className="todo-input-button">
        Add
      </button>
    </form>
  )
}

export default TodoInput
