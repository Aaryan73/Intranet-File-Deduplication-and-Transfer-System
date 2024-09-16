"use client";
import React from "react";
import { IoIosCloudDownload } from "react-icons/io";

export function Hero() {
  return (
    <div id="home" className="h-[40rem] w-full rounded-md  relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-center gap-4 px-1 py-3">
          <IoIosCloudDownload className='text-blue-600' fontSize={32} />
          <h2 className="text-neutral-200 font-semibold text-4xl">DupAlert</h2>
        </div>
        <h1 className="relative z-10 text-lg md:text-5xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          Data download Duplication Alert System (DDAS)
        </h1>
        <p></p>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          Applicable across various fields and industries, including academic institutions, research facilities, government agencies, and more.
        </p>
        {/* <input
          type="text"
          placeholder="hi@manuarora.in"
          className="rounded-lg px-6 text-white py-4 border border-neutral-800 focus:ring-2 focus:ring-teal-500  w-full relative z-10 mt-4  bg-neutral-950 placeholder:text-neutral-600"
        /> */}
      </div>
      <button className="px-10 py-3 border-gray-600  bg-black border text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg">
        Download
      </button>
    </div>
  );
}
