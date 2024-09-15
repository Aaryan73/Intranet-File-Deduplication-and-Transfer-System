import { IoIosArrowRoundBack } from "react-icons/io";
import { useTab } from "../hooks/TabContext";
import { CiLogout } from "react-icons/ci";

const Profile = () => {
  const { switchTab } = useTab();
  const handleDeleteAccount = () => {
    console.log('Account deleted');
  };

  const handleChangePassword = () => {
    console.log('Change password');
  };

  const handleLogin = () => {
    switchTab('login');
    console.log('Change password');
  };

  return (
    <div className="flex relative justify-center items-center min-h-screen ">
      <button onClick={() => { switchTab('popup') }} className="px-6  fixed top-4 left-4 flex items-center justify-center gap-2  py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"><IoIosArrowRoundBack /> back</button>
      <div className=" p-6 rounded-lg  max-w-sm w-full text-center">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h1 className="text-2xl font-semibold mb-4">Username123</h1>

        <button
          onClick={handleChangePassword}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg mb-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Change Password
        </button>
        <button
          onClick={handleDeleteAccount}
          className="w-full bg-red-500 text-white py-2 mb-2 px-4 rounded-lg  hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Delete Account
        </button>
        <button onClick={handleLogin} className="px-4 flex w-full items-center justify-center gap-2  py-2 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"><CiLogout /> logout</button>
      </div>
    </div>
  );
};

export default Profile;
