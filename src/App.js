import './App.css';
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import RootRouter from './components/admin/rootRouter';
import RootRouterWeb from './components/web/rootRouter';
import NotFound from './components/404NotFound/NotFound';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import { getUserByEmail } from './components/services/userService';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    let email = localStorage.getItem('email');
    if (email) {
      let user = await getUserByEmail(email);
      if (user && user.data.errCode === 0) {
        if (user.data.user.email === 'admin@gmail.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
    }
  }
  console.log(isAdmin);
  return (
    <>
      <Routes>
        {isAdmin ? (
          <Route exact path='/admin/*' element={<RootRouter />} />
        )
          :
          <Route exact path='/*' element={<RootRouterWeb />} />
        }
        <Route exact path='/register' element={<Register />} />
        <Route exact path='/login' element={<Login />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
}
export default App;