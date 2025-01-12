'use client'

import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Admin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
    
        try {
          const response = await axios.post(`${process.env.SERVER}/api/v1/user/login`, { username, password });
          localStorage.setItem('token', response.data.token); // Store the JWT in localStorage
          router.push('/');
        } catch (err: any) {
          setError(err.response?.data?.message || 'Login failed');
        }
    };

  return (
    <>
        <div className="w-[90%] mt-40 sm:w-3/4 md:w-1/2 m-auto">
            <h1 className="text-4xl text-center font-bold text-black dark:text-white">Admin Login</h1>
            <form onSubmit={handleLogin}>
                <div className="p-6.5">

                <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Username <span className="text-meta-1">*</span>
                    </label>
                    <input
                    type="text"
                    placeholder="Enter your email address"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Password <span className="text-meta-1">*</span>
                    </label>
                    <input
                    type="password"
                    placeholder="Enter your email address"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <button 
                    type="submit"
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                    Login
                </button>
                </div>
            </form>
        </div>
    </>
  );
}