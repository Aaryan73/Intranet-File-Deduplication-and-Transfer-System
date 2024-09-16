'use client'
import Link from 'next/link';
import { useState } from 'react';
import { IoIosCloudDownload } from 'react-icons/io';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPassword', password);
    console.log('Email:', email);
    console.log('Password:', password);
    toast.success("Login Successful");
  };

  return (
    <main className="w-full h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-gray-200 space-y-5">
        <div className="text-center ">
          <div className="flex items-center justify-center gap-4 px-1 py-3">
            <IoIosCloudDownload className='text-blue-600' fontSize={32} />
            <h2 className="text-neutral-200 font-semibold text-4xl">DupAlert</h2>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col items-start justify-center gap-5 w-full">
          <div>
            <label className="font-medium ">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-96 mt-2 px-3 py-2 text-gray-100 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
          </div>
          <div>
            <label className="font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-96 mt-2 px-3 py-2 text-gray-100 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
          </div>



          <Link
            onClick={handleSubmit}
            href={'/admin/dashboard'}
            className="w-full px-4 py-2 text-center text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
          >
            Sign in
          </Link>
        </form>

      </div>
    </main>
  );
};

export default Login;
