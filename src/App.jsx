import { useState, useEffect } from 'react'
import TodoInput from './TodoInput'
import TodoList from './TodoList'

const API_BASE = 'http://localhost:4000/api/todos'

function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(API_BASE)
      if (!response.ok) throw new Error('Failed to fetch todos')
      const data = await response.json()
      setTodos(data)
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (title) => {
    setError('')
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      })
      if (!response.ok) throw new Error('Failed to add todo')
      const newTodo = await response.json()
      setTodos([...todos, newTodo])
    } catch (err) {
      setError('Something went wrong')
    }
  }

  const toggleTodo = async (id, completed) => {
    setError('')
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      })
      if (!response.ok) throw new Error('Failed to update todo')
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed } : todo
      ))
    } catch (err) {
      setError('Something went wrong')
    }
  }

  const deleteTodo = async (id) => {
    setError('')
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete todo')
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (err) {
      setError('Something went wrong')
    }
  }

  return (
    <div className="app">
      <h1>TODO App</h1>
      {error && <div className="error">{error}</div>}
      <TodoInput onAdd={addTodo} />
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <TodoList 
          todos={todos} 
          onToggle={toggleTodo} 
          onDelete={deleteTodo} 
        />
      )}
    </div>
  )
}

export default App
