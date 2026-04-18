import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function TodoList() {
  const todos = [
    {id: 1, text: "Learn JSX"},
    { id: 2, text: "Understand props" },
    { id: 3, text: "Master state and events" },
  ];

  return (
    <div>
      <h2>My React Todos</h2>
      <ul>
        <li>Learn JSX</li>
        <li>Understand props</li>
        <li>Master state and events</li>
      </ul>
    </div>
  )
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TodoList />
             
    </>
  )
}

export default App
