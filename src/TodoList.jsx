import TodoItem from './TodoItem'

function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return <div className="empty-state">No todos yet. Add one above!</div>
  }

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default TodoList
