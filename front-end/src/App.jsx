import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Login } from './pages/Login/Login'
import { Register } from './pages/Register/Register'
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    
    <>
    <Toaster />


      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  )
}

export default App
