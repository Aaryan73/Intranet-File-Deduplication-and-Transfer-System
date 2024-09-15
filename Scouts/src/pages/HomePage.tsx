import { IoStarSharp } from "react-icons/io5";
import { useTab } from "../hooks/TabContext";

export const HomePage = () => {
  const { switchTab } = useTab();

  return (
    <div className="relative bg-gray-900">
      <section className="relative">
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-28 md:px-8">
          <div className="space-y-5 max-w-4xl mx-auto text-center">
            <h2 className="text-2xl text-white font-extrabold mx-auto md:text-5xl">
              {'Data download Duplication Alert System (DDAS)'}
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400">
              Applicable across various fields and industries, including academic institutions, research facilities, government agencies, and more.
            </p>
            <button onClick={() => { switchTab('register') }} className="flex items-center justify-center gap-x-2 py-2.5 px-4 mt-3 w-full text-sm text-white font-medium bg-blue-500 hover:bg-sky-400 active:bg-sky-600 duration-150 rounded-lg sm:mt-0 sm:w-auto">
              Get started
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="flex justify-center items-center gap-x-4 text-gray-400 text-sm">
              <div className="flex">
                <IoStarSharp className="text-yellow-500" />
                <IoStarSharp className="text-yellow-500" />
                <IoStarSharp className="text-yellow-500" />
                <IoStarSharp className="text-yellow-500" />
                <IoStarSharp className="text-yellow-500" />
              </div>
              <p><span className="text-gray-100">5.0</span></p>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg" style={{ background: "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)" }}></div>
      </section>
    </div>
  )
}
