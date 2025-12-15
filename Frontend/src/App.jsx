import React from 'react'
import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login.jsx'
import Home from './components/Home.jsx';
import { Header } from './components/Navbar.jsx';
import AboutPage from './components/About.jsx';
import ProductDetail from './components/productDetail.jsx';
function App() {
  
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        
        <Route path='/login' element={<Login/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/about-us' element={<AboutPage/>}/>
        <Route path='/product/:id' element={<ProductDetail/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
