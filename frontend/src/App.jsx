import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Orders from './pages/Orders'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Header />
        <main style={{ padding: "20px", minHeight: "60vh" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
        <Footer />
      </div>
             
    </>
  )
}

export default App
