import React, { useState, useEffect } from 'react'
import TodoInput from './TodoInput'
import TodoList from './TodoList'

const API_BASE_URL = 'http://localhost:4000/api/todos'

function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(API_BASE_URL)
      if (!response.ok) throw new Error('Failed to load todos')
      const data = await response.json()
      setTodos(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (title) => {
    if (!title.trim()) return
    
    setError('')
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() })
      })
      if (!response.ok) throw new Error('Failed to add todo')
      const newTodo = await response.json()
      setTodos(prev => [...prev, newTodo])
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleTodo = async (id, completed) => {
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      })
      if (!response.ok) throw new Error('Failed to update todo')
      const updatedTodo = await response.json()
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ))
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteTodo = async (id) => {
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete todo')
      setTodos(prev => prev.filter(todo => todo.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="app">
      <h1>TODO App</h1>
      <TodoInput onAdd={addTodo} />
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}
      <TodoList 
        todos={todos} 
        onToggle={toggleTodo} 
        onDelete={deleteTodo} 
      />
    </div>
  )
}

export default App
