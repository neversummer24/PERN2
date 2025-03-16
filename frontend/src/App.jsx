import {useEffect, useState} from 'react'
import {Link, Navigate, Outlet, Route, Routes} from 'react-router-dom'
import SignIn from './pages/auth/signIn'
import SignUp from './pages/auth/signUp'
import Dashboarad from './pages/Dashboard'
import Account from './pages/account'
import Transaction from './pages/transaction'
import Setting from './pages/setting'
import { ProtectedRoute } from './pages/ProtectedRoute'
import  userStore  from './store'
import { setAuthToken } from './libs/authApiCall'
import { Toaster } from 'sonner'
import Navbar from './components/ui/navbar'


const RootlayOut = () => {
  const user = userStore((state) => state.user);

  setAuthToken(user?.token ?? "");

  return !user ? (
    <Navigate to="/sign-in" replace />
  ) : (
    <>
      <Navbar />
      <div className='min-h-[cal(h-screen-100px)]'>
        <Toaster />
        <Outlet />
      </div> 
    </>
  
  
  );
    
}

function App() {
  const {theme} = userStore((state) => state);
  console.log("theme:",theme);

  useEffect(()=>{
    if(theme === "dark"){
      console.log("added dark");
      document.body.classList.add("dark")
    } else {
      console.log("remove dark");
      document.body.classList.remove("dark")
    }

    return () => {
      document.body.classList.remove("dark");
    };
  },[theme]);
 

  return (
    <main>
      <div className='w-full min-h-screen px-6 bg-gray-100 md:px-20 dark:bg-slate-900'>
      
        <Routes>

          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          <Route path="/" element={<ProtectedRoute><RootlayOut /></ProtectedRoute>}>  
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboarad />} />
            <Route path="account" element={<Account />} />
            <Route path="transaction" element={<Transaction />} />
            <Route path="setting" element={<Setting />} />
          </Route>

        </Routes>
      </div>
    </main>
  )
}

export default App
