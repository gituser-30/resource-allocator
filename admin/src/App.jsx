import React from 'react'
import { BrowserRouter, Route,Routes } from "react-router-dom";
import AdminLogin from './Admin2/adminlogin';
import AdminDashboard from './Admin2/Admindashboard';

const App = () => {
  return (
    <>
      <BrowserRouter>


        <Routes>
          <Route path='/' element={<AdminLogin/>}/>
          <Route path='/admin2/Admindashboard' element={<AdminDashboard/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App