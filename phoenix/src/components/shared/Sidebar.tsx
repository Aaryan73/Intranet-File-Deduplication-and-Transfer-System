'use client'
import React from 'react';
import Link from 'next/link';
import { HiOutlineLogout } from 'react-icons/hi';
import { IoIosCloudDownload } from "react-icons/io";
import { DASHBOARD_SIDEBAR_LINKS, DASHBOARD_SIDEBAR_BOTTOM_LINKS } from '../../lib/constants';
import toast from 'react-hot-toast';

interface SidebarLink {
  path: string;
  label: string;
  icon: React.ReactNode;
  key: string
}

const linkClass = 'flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base';

const Sidebar: React.FC = () => {

  const handleLogout = () => {
    toast.success("Logout successful");
  }

  return (
    <div className="bg-neutral-900 w-60 p-3 flex flex-col">
      <div className="flex items-center gap-2 px-1 py-3">
        <IoIosCloudDownload className='text-blue-600' fontSize={24} />
        <span className="text-neutral-200 text-lg">DupAlert</span>
      </div>
      <div className="py-8 flex flex-1 flex-col gap-0.5">
        {DASHBOARD_SIDEBAR_LINKS.map((link) => (
          <SidebarLink key={link.key} link={link} activePath={'admin'} />
        ))}
      </div>
      <div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-700">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
          <SidebarLink key={link.key} link={link} activePath={'admin'} />
        ))}
        <Link href={'/'} onClick={handleLogout} className={`${linkClass} cursor-pointer text-red-500`}>
          <span className="text-xl">
            <HiOutlineLogout />
          </span>
          Logout
        </Link>
      </div>
    </div>
  );
};

// SidebarLink component
interface SidebarLinkProps {
  link: SidebarLink;
  activePath: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ link, activePath }) => {
  return (
    <Link href={link.path}
      className={`${activePath === link.path ? 'bg-neutral-700 text-white' : 'text-neutral-400'} ${linkClass}`}
    >
      <span className="text-xl">{link.icon}</span>
      {link.label}
    </Link>
  );
};

export default Sidebar;
