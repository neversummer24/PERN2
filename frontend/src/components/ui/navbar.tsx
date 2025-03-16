import{
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Popover,
    PopoverButton,
    PopoverPanel,
} from '@headlessui/react'

import userStore from '../../store/index'
import React, { useState } from 'react'
import {MdOutlineClose, MdOutlineKeyboardArrowDown} from 'react-icons/md'

import {Link, useLocation, useNavigate} from 'react-router-dom'

import {IoIosMenu} from 'react-icons/io'
import {auth} from '../../libs/firebaseConfig'
import { ThemeSwitch } from './switch'
import {TransitionWrapper} from '../wrapper/transition-wrapper'


const links = [
    {label:"Dashboard",link:"/dashboard"},
    {label:"Account",link:"/account"},
    {label:"Transaction",link:"/transaction"},
    {label:"Setting",link:"/setting"},
];




const UserMenu = () => {
    const logout = userStore((state) => state.logout);
    
    const {user, setUser} = userStore((state) => state);
    const navigate = useNavigate();

    const handleSocialLogout = async () => {
         try{
            await logout(auth);
         }catch(error){
            console.log("error in social logout",error);
         }   
    }

    const handleLogout = async () => {
        if(user.provideer === "google"){
            await handleSocialLogout();
        }else   {
           await logout();
        }
        setUser(null);
        navigate("/sign-in");  
    }


    return(
        <Menu as = "div" className="relative z-50">
            <div>
                <MenuButton className="">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-10 h-10 text-white rounded-full
                        cursor-pointer 2xl:w-12 2xl:h-12 ">
                            <p className = "text-2xl font-semibold">User</p>
                        </div>
                        <p className = "hidden text-sm font-semibold md:block">{user?.name}</p>
                        <MdOutlineKeyboardArrowDown className = "hidden md:block text-2xl text-gray-600 cursor-pointer dark:text-gray-300"/>
                    </div>

                </MenuButton>
            </div>

            <TransitionWrapper>
                <MenuItems className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg
                ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-3">
                        <p className = "text-sm font-semibold">{user?.name}</p>
                        <p className = "text-sm text-gray-600">{user?.email}</p>
                    </div>
                    <div className="py-1">
                        {links.map((link) => (
                            <MenuItem key={link.label}>
                                <Link to={link.link} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white">
                                    {link.label}
                                </Link>
                            </MenuItem>
                        ))} 
                    </div>
                    <div className="py-1">
                        <MenuItem>
                            <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white">
                                Logout
                            </button>
                        </MenuItem>
                    </div>
                </MenuItems>
            </TransitionWrapper>
        </Menu>
    )
}

const MobileSidebar = () => {
    const location = useLocation();
    const path = location.pathname;
    const logout = userStore((state) => state.logout);

    return(
        <div className="">
            <Popover className="">
                {({open}) => (
                    <>
                        <PopoverButton className="flex items-center justify-center w-10 h-10 text-white rounded-full cursor-pointer
                        md:hidden">
                            {open ? <MdOutlineClose className="text-2xl"/> : <IoIosMenu className="text-2xl"/>}
                      
                        </PopoverButton>
                        <TransitionWrapper>
                            <PopoverPanel className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg
                            ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="px-4 py-3">
                                    <p className = "text-sm font-semibold">Welcome {userStore((state) => state.user?.name)}</p>
                                </div>
                                <div className="py-1">
                                    {links.map((link) => (  
                                        <MenuItem key={link.label}>
                                            <Link to={link.link} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white">
                                                {link.label}
                                                <PopoverButton className="flex items-center justify-center w-10 h-10 text-white rounded-full cursor-pointer
                                                md:hidden">
                                                    {open ? <MdOutlineClose className="text-2xl"/> : <IoIosMenu className="text-2xl"/>}
                                                </PopoverButton>
                                            </Link>
                                        </MenuItem>
                                    ))}
                                </div>
                                <div className="py-1">
                                    <MenuItem>
                                        <button onClick={logout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white">
                                            Logout
                                        </button>
                                    </MenuItem>
                                </div>
                            </PopoverPanel>
                        </TransitionWrapper>
                    </>
                )} 
            </Popover>
        </div>
    )
}


const Navbar = () => {
    return (
        <div className="flex items-center justify-between px-4 py-3 bg-blue-100 dark:bg-gray-800">
            <div className="flex items-center">
                <p className = "text-2xl font-semibold text-gray-600 dark:text-gray-300">My Finance</p>
            </div>

            <div className="smd:block">
                <div className="flex items-center space-x-4">
                    {links.map((link) => (
                        <Link to={link.link} className="text-sm font-semibold text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white">    
                            {link.label}    
                        </Link>
                    ))}
                </div>
            </div>

            
            <div className="flex items-center">
                <UserMenu/>
                {/* <MobileSidebar/> */}
                <ThemeSwitch/>
            </div>
        </div>
    )
  };
  
  export default Navbar;

