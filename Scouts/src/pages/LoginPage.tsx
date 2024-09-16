import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useTab } from '../hooks/TabContext';
import axios from 'axios';
import qs from 'qs'

const LoginPage = () => {
  const { switchTab } = useTab();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username || !password) {
      toast.error('Please fill in both fields');
      return;
    }

    try {
      const response = await axios.post('http://52.172.0.204:8080/api/user/token', qs.stringify({
        username,
        password
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.status === 200) {
        switchTab('popup');
        toast.success('Login Successful');
        localStorage.setItem('accessToken', response.data.access_token);
      } else {
        toast.error('Login Failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login Failed';
      toast.error(errorMessage);
    }
  };

  return (
    <section className="max-w-4xl w-full p-6 mx-auto bg-gray-800 rounded-md shadow-md dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-white capitalize">Log In</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid w-full grid-cols-1 gap-6 mt-4">
          <div>
            <label className="text-gray-200" htmlFor="username">Email</label>
            <input
              id="username"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
        </div>

        <div className="flex justify-end mt-6">
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

export default LoginPage;
