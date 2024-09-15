import toast from "react-hot-toast";
import { useTab } from "../hooks/TabContext";

const LoginPage = () => {
  const { switchTab } = useTab();

  const onSubmit = () => {
    switchTab('popup');
    toast.success('Login Successful')
  }
  return (
    <section className="max-w-4xl w-full p-6 mx-auto bg-gray-800 rounded-md shadow-md dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-white capitalize">Account settings</h2>

      <form>
        <div className="grid w-full   grid-cols-1 gap-6 mt-4">
          <div>
            <label className="text-gray-200" htmlFor="username">Username</label>
            <input id="username" type="text" className="block w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
          </div>

          <div>
            <label className="text-gray-200" htmlFor="password">Password</label>
            <input id="password" type="password" className="block w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button onClick={onSubmit} className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">Save</button>
        </div>
      </form>
    </section>
  );
}

export default LoginPage;
