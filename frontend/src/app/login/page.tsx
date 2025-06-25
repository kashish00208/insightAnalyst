"use client"
import React, { useState } from 'react'

const page = () => {
  const [email ,setEmail] = useState(null);
  const [password , setPassword]  = useState(null);
  const [msg,setMsg] = useState(null);
  const handleSubmit = () => {

  }
  return (
    <div className='bg-gradient-to-r from-zinc-600 to-stone-600 w-screen h-screen flex flex-row justify-center items-center' >
      <div className='bg-gradient-to-r from-zinc-800 to-stone-800 w-1/4 rounded-2xl h-3/5 '>
      <p className="text-lg font-semibold text-center m-2">LOGIN</p>
        <form action="loginForm">
         <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <input type="text" />
          <label htmlFor="password"></label>
        </form>
      </div>
    </div>
  )
}

export default page
