import React from 'react'
import Link from 'next/link'

interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

const activeUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    isActive: true
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    isActive: false
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    isActive: true
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@example.com',
    isActive: true
  },
  {
    id: '5',
    name: 'Eva Green',
    email: 'eva@example.com',
    isActive: false
  },
  {
    id: '7',
    name: 'David Wilson',
    email: 'david@example.com',
    isActive: true
  },
  {
    id: '8',
    name: 'Eva Green',
    email: 'eva@example.com',
    isActive: false
  }

]

const ActiveUsers: React.FC = () => {
  return (
    <div className="w-[20rem] bg-gray-800 p-4 rounded-sm border border-gray-600">
      <strong className="text-gray-300 font-medium">Active Users</strong>
      <div className="mt-4 flex flex-col gap-3">
        {activeUsers.map((user) => (
          <Link
            key={user.id}
            href={`/user/${user.id}`}
            className="flex items-start hover:no-underline"
          >
            <div className="w-10 h-10 min-w-[2.5rem] bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">{user.name.charAt(0)}</span>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm text-gray-200">{user.name}</p>
              <span
                className={`${user.isActive
                  ? 'text-green-400'
                  : 'text-red-500'
                  } text-xs font-medium`}
              >
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="text-xs text-gray-400 pl-1.5">{user.email}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ActiveUsers
