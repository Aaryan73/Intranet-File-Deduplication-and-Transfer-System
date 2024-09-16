import React from 'react'
import { IoPieChart, IoPeople, IoCart } from 'react-icons/io5'
import { AiFillDatabase } from "react-icons/ai";
// Define a type for the BoxWrapper component's props
interface BoxWrapperProps {
  children: React.ReactNode;
}

const BoxWrapper: React.FC<BoxWrapperProps> = ({ children }) => {
  return (
    <div className="bg-gray-800 rounded-sm p-4 flex-1 border border-gray-700 flex items-center">
      {children}
    </div>
  )
}

const DashboardStatsGrid: React.FC = () => {
  return (
    <div className="flex gap-2 ">
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
          <AiFillDatabase className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-400 font-light">Total Bandwidth saved</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-400 font-semibold">54232 kb</strong>
            <span className="text-sm text-green-500 pl-2">+343</span>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
          <IoPieChart className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-400 font-light">Total Files Transferred</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-400 font-semibold">40</strong>
            <span className="text-sm text-green-500 pl-2">+21</span>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400">
          <IoPeople className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-400 font-light">Total Users</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-400 font-semibold">120</strong>
            <span className="text-sm text-green-500 font-bold pl-2">45 active</span>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
          <IoCart className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-400 font-light"> Daily Transactions</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-400 font-semibold">1643</strong>
            <span className="text-sm text-blue-500 pl-2">+43</span>
          </div>
        </div>
      </BoxWrapper>
    </div>
  )
}

export default DashboardStatsGrid
