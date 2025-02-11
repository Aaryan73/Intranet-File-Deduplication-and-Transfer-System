import React, { Fragment } from 'react'
import { Menu, Popover, Transition } from '@headlessui/react'
import { HiOutlineBell, HiOutlineChatAlt } from 'react-icons/hi'

export default function Header() {

  return (
    <div className="bg-none h-16 px-4 flex items-center border-b border-gray-900 justify-end">

      <div className="flex items-center gap-2 mr-2">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`group inline-flex items-center rounded-sm p-1.5 text-gray-100 hover:text-opacity-100 focus:outline-none ${open ? 'bg-gray-900' : 'active:bg-gray-900'}`}
              >
                <HiOutlineChatAlt fontSize={24} />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-2.5 transform w-80">
                  <div className="bg-black rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                    <strong className="text-gray-100 font-medium">Messages</strong>
                    <div className="mt-2 py-1 text-sm">This is messages panel.</div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`group inline-flex items-center rounded-sm p-1.5 text-gray-100 hover:text-opacity-100 focus:outline-none ${open ? 'bg-gray-900' : 'active:bg-gray-900'}`}
              >
                <HiOutlineBell fontSize={24} />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-2.5 transform w-80">
                  <div className="bg-gray-900 rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                    <strong className="text-gray-100 font-medium">Notifications</strong>
                    <div className="mt-2 py-1 text-sm">This is notification panel.</div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <Menu as="div" className="relative">
          <div>
            <Menu.Button className="ml-2 bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400">
              <span className="sr-only">Open user menu</span>
              <div
                className="h-10 w-10 rounded-full bg-sky-500 bg-cover bg-no-repeat bg-center"
                style={{ backgroundImage: 'url("https://source.unsplash.com/80x80?face")' }}
              >
                <span className="sr-only">Marc Backes</span>
              </div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-sm shadow-md p-1 bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <div
                    onClick={() => { }}
                    className={`active:text-gray-900 rounded-sm px-4 py-2 text-gray-100 cursor-pointer ${active ? 'bg-gray-900' : 'focus:text-gray-900'}`}
                  >
                    Your Profile
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div
                    onClick={() => { }}
                    className={`active:text-gray-900 rounded-sm px-4 py-2 text-gray-100 cursor-pointer ${active ? 'bg-gray-900' : 'focus:text-gray-900'}`}
                  >
                    Settings
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={`active:text-gray-900 rounded-sm px-4 py-2 text-gray-100 cursor-pointer ${active ? 'bg-gray-900' : 'focus:text-gray-900'}`}
                  >
                    Sign out
                  </div>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  )
}
