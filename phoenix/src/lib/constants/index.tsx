import {
  HiOutlineViewGrid,
  HiOutlineCube,
  HiOutlineQuestionMarkCircle,
  HiOutlineCog
} from 'react-icons/hi'
import { IoPeople } from 'react-icons/io5'


export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: <HiOutlineViewGrid />
  },
  {
    key: 'File Transfers',
    label: 'File Transfers',
    path: '/admin/filetransfer',
    icon: <HiOutlineCube />
  },
  {
    key: 'Users',
    label: 'Users',
    path: '/admin/users',
    icon: <IoPeople />
  }
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  {
    key: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: <HiOutlineCog />
  },
  {
    key: 'support',
    label: 'Help & Support',
    path: '/support',
    icon: <HiOutlineQuestionMarkCircle />
  }
]
