import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { BiChevronDown } from 'react-icons/bi';
import { useState } from 'react';

const dummyUsers = [
  {
    id: 1,
    name: "Arthur Melo",
    username: "@authurmelo",
    status: "Active",
    role: "Design Director",
    email: "authurmelo@example.com",
    teams: ["Design", "Product", "Marketing"],
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
  },
  {
    id: 2,
    name: "Emma Watson",
    username: "@emmawatson",
    status: "Inactive",
    role: "Project Manager",
    email: "emmawatson@example.com",
    teams: ["Product"],
    avatar: "https://images.unsplash.com/photo-1506748686214e9df14f6dd1a1a7a3f1d3f1d5e8fa7c?crop=entropy&cs=tinysrgb&fit=max&ixid=MXwzNjUyOXwwfDF8c2VhcmNofDJ8fGVtbWEfd2F0c29ufGVtYWlsX2Zvc3RlcnxlbnwwfDF8fDE2Nzg0MTkxOTg&ixlib=rb-1.2.1&q=80&w=400",
  },
  {
    id: 3,
    name: "John Doe",
    username: "@johndoe",
    status: "Active",
    role: "Software Engineer",
    email: "johndoe@example.com",
    teams: ["Development"],
    avatar: "https://images.unsplash.com/photo-1542722780-c8d037f8edc6?crop=entropy&cs=tinysrgb&fit=max&ixid=MXwzNjUyOXwwfDF8c2VhcmNofDJ8fGphbmRfZG9lfGVtYWlsX2Zvc3RlcnxlbnwwfDF8fDE2Nzg0MTk1Njk&ixlib=rb-1.2.1&q=80&w=400",
  },
  {
    id: 4,
    name: "Sophia Brown",
    username: "@sophiabrown",
    status: "Active",
    role: "UX Designer",
    email: "sophiabrown@example.com",
    teams: ["Design"],
    avatar: "https://images.unsplash.com/photo-1563824975-0f6a4358a7a0?crop=entropy&cs=tinysrgb&fit=max&ixid=MXwzNjUyOXwwfDF8c2VhcmNofDJ8fHNvcGhpYS1icm93bnxlbnwwfDF8fDE2Nzg0MTk0NTE&ixlib=rb-1.2.1&q=80&w=400",
  },
  {
    id: 5,
    name: "Liam Smith",
    username: "@liamsmith",
    status: "Inactive",
    role: "Data Scientist",
    email: "liamsmith@example.com",
    teams: ["Data"],
    avatar: "https://images.unsplash.com/photo-1506748686214-e9df14f6dd1a?crop=entropy&cs=tinysrgb&fit=max&ixid=MXwzNjUyOXwwfDF8c2VhcmNofDJ8fGxpYW1fc21pdGhlbnxlbnwwfDF8fDE2Nzg0MTk2NTI&ixlib=rb-1.2.1&q=80&w=400",
  },
  {
    id: 6,
    name: "Olivia Johnson",
    username: "@oliviajohnson",
    status: "Active",
    role: "Marketing Specialist",
    email: "oliviajohnson@example.com",
    teams: ["Marketing"],
    avatar: "https://images.unsplash.com/photo-1594832246800-1a17e0f5b6d2?crop=entropy&cs=tinysrgb&fit=max&ixid=MXwzNjUyOXwwfDF8c2VhcmNofDJ8fG9saXZpYS1qb2huc29ufGVtYWlsX2Zvc3RlcnxlbnwwfDF8fDE2Nzg0MTk3Mzc&ixlib=rb-1.2.1&q=80&w=400",
  },
  {
    id: 7,
    name: "Noah Davis",
    username: "@noahdavis",
    status: "Active",
    role: "Sales Manager",
    email: "noahdavis@example.com",
    teams: ["Sales"],
    avatar: "https://images.unsplash.com/photo-1543796123-3c237d4e51b4?crop=entropy&cs=tinysrgb&fit=max&ixid=MXwzNjUyOXwwfDF8c2VhcmNofDJ8fG5vaGFkX2RhdmVzfGVtYWlsX2Zvc3RlcnxlbnwwfDF8fDE2Nzg0MTk4NTI&ixlib=rb-1.2.1&q=80&w=400",
  },
  {
    id: 8,
    name: "Isabella Garcia",
    username: "@isabellagarcia",
    status: "Inactive",
    role: "Product Designer",
    email: "isabellagarcia@example.com",
    teams: ["Design", "Product"],
    avatar: "https://images.unsplash.com/photo-1520966054882-26d6090359b8?crop=entropy&cs=tinysrgb&fit=max&ixid=MXwzNjUyOXwwfDF8c2VhcmNofDJ8fGlzYWJlbGxhX2dhcmNpYXxlbnwwfDF8fDE2Nzg0MTk4MzM&ixlib=rb-1.2.1&q=80&w=400",
  },
  {
    id: 9,
    name: "Ethan Martinez",
    username: "@ethanmartinez",
    status: "Active",
    role: "DevOps Engineer",
    email: "ethanmartinez@example.com",
    teams: ["Operations"],
    avatar: "https://images.unsplash.com/photo-1517816758040-2a9b5b63480a?crop=entropy&cs=tinysrgb&fit=max&ixid=MXwzNjUyOXwwfDF8c2VhcmNofDJ8fGV0aGFuX21hcnRpbmV6fGVtYWlsX2Zvc3RlcnxlbnwwfDF8fDE2Nzg0MTk5MTM&ixlib=rb-1.2.1&q=80&w=400",
  },
  {
    id: 10,
    name: "Ava Wilson",
    username: "@avawilson",
    status: "Inactive",
    role: "Customer Support",
    email: "avawilson@example.com",
    teams: ["Support"],
    avatar: "https://images.unsplash.com/photo-1566180502-2d92b6f8b832?crop=entropy&cs=tinysrgb&fit=max&ixid=MXwzNjUyOXwwfDF8c2VhcmNofDJ8fGF2YV93aWxzb258fGVtYWlsX2Zvc3RlcnxlbnwwfDF8fDE2Nzg0MTk5ODI&ixlib=rb-1.2.1&q=80&w=400",
  },
];

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = dummyUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="container px-4 mx-auto">
      <div className="flex items-center gap-x-3">
        <h2 className="text-lg font-semibold text-gray-100 ">Total Users</h2>
        <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">10 users</span>
      </div>

      <div className="mt-4 relative">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border relative z-50 bg-gray-800 rounded-md border-gray-800 focus:outline-none text-white"
        />
      </div>

      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-x-3">
                        <input type="checkbox" className="text-blue-500 rounded bg-gray-900border-gray-700" />
                        <span>Name</span>
                      </div>
                    </th>
                    <th scope="col" className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-400">
                      <button className="flex items-center gap-x-2">
                        <span>Status</span>
                        <BiChevronDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-400">
                      Files Downloaded
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-400">
                      Files Shared
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-400">Email address</th>
                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-400">Options</th>

                  </tr>
                </thead>
                <tbody className="ivide-gray-700 bg-gray-900">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                        <div className="inline-flex items-center gap-x-3">
                          <input type="checkbox" className="text-blue-500  roundedbg-gray-900 ring-offset-gray-900 border-gray-700" />
                          <div className="flex items-center gap-x-2">
                            <div>
                              <h2 className="font-medium text-white">{user.name}</h2>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-12 py-4 text-sm font-medium text-gray-300 whitespace-nowrap">
                        <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-gray-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-800"></span>
                          <h2 className="text-sm font-normal text-emerald-500">{user.status}</h2>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-300 whitespace-nowrap">25</td>
                      <td className="px-4 py-4 text-sm text-gray-300 whitespace-nowrap">12</td>
                      <td className="px-4 py-4 text-sm text-gray-300 whitespace-nowrap">{user.email}</td>

                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="flex items-center gap-x-6">
                          <button className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none">
                            <FaTrashAlt className="w-5 h-5" />
                          </button>
                          <button className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none">
                            <FaEdit className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserManagement;
