"use client";
import React, { useState } from "react";
import { signInWithEmailAndPassword , createUserWithEmailAndPassword} from "firebase/auth";
import { auth } from "../../../lib/firebaseConfig";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    await createUserWithEmailAndPassword(auth,email,password)
    console.log("user created succesfully")
    const res = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = await res.user.getIdToken();
    console.log("Token:", token);
    setMsg("Login successful!");
  } catch (err: any) {
    console.error("Error:", err.code, err.message);
    setMsg(`Login failed: ${err.message}`);
  }

};


  return (
    <div className="bg-gradient-to-r from-zinc-600 to-stone-600 w-screen h-screen flex justify-center items-center">
      <div className="bg-gradient-to-r from-zinc-800 to-stone-800 w-1/4 p-6 rounded-2xl shadow-lg text-white">
        <p className="text-xl font-bold text-center mb-6">LOGIN</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-black"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
          >
            Login
          </button>

          {msg && (
            <p className="text-center mt-4 text-sm text-yellow-300">{msg}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Page;
