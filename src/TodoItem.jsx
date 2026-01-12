function TodoItem({ todo, onToggle, onDelete }) {
  const handleToggle = () => {
    onToggle(todo.id, !todo.completed)
  }

  const handleDelete = () => {
    onDelete(todo.id)
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className="todo-checkbox"
      />
      <span className="todo-title">{todo.title}</span>
      <button onClick={handleDelete} className="todo-delete">
        Delete
      </button>
    </div>
  )
}

export default TodoItem
