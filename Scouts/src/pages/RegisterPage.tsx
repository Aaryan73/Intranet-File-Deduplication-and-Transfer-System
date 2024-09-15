import React, { useState, FormEvent } from 'react';
import { useTab } from "../hooks/TabContext";
import toast from "react-hot-toast";

const RegisterPage: React.FC = () => {
  const { switchTab } = useTab();

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    localStorage.setItem('userData', JSON.stringify({
      username,
      email,
      password,
      passwordConfirmation,
    }));

    switchTab('popup');
    toast.success("Register Success");
  }

  const goToLogin = () => {
    switchTab('login');
  }

  return (
    <section className="max-w-4xl w-full p-6 mx-auto bg-gray-800 rounded-md shadow-md dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-white capitalize">Account settings</h2>

      <form onSubmit={onSubmit}>
        <div className="grid w-full grid-cols-1 gap-6 mt-4">
          <div>
            <label className="text-gray-200" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label className="text-gray-200" htmlFor="emailAddress">Email Address</label>
            <input
              id="emailAddress"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label className="text-gray-200" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label className="text-gray-200" htmlFor="passwordConfirmation">Password Confirmation</label>
            <input
              id="passwordConfirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="block w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={goToLogin}
            className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
          >
            Login
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
          >
            Save
          </button>
        </div>
      </form>
    </section>
  );
}

export default RegisterPage;
