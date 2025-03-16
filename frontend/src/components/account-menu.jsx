import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/react';
import { BiTransfer } from 'react-icons/bi';
import {FaMoneyCheck} from 'react-icons/fa';
import { MdMoreVert } from 'react-icons/md';
import clsx from 'clsx';
import {TransitionWrapper} from './wrapper/transition-wrapper';

export default function AccountMenu( {transferMoney, addMoney} ) {
    return <>
        <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <MdMoreVert className="w-5 h-5" />
            </MenuButton>

            <TransitionWrapper>
                <MenuItems className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1 px=1 space-y-2">
                        <MenuItem>
                            {({focus}) => (
                                <button onClick={transferMoney}
                                className={clsx('flex items-center gap-x-3 rounded-md px-3 py-2 text-sm leading-6 font-semibold text-gray-900',focus && "bg-gray-200")}>
                                    <BiTransfer className="w-6 h-6" />
                                    <span>Transfer Money</span>
                                </button>
                            )}
                        </MenuItem>

                        <MenuItem>
                             {({focus}) => (
                                <button onClick={transferMoney}
                                className={clsx('flex items-center gap-x-3 rounded-md px-3 py-2 text-sm leading-6 font-semibold text-gray-900',focus && "bg-gray-200")}>
                                      <FaMoneyCheck className="w-6 h-6" />
                                      <span>Add Money</span>
                                </button>
                            )}
                        </MenuItem>
                    </div>
                </MenuItems>
            </TransitionWrapper>
        </Menu>
    
    
    </>
}    