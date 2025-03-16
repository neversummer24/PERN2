import { DialogWrapper } from '../wrapper/dialog-wrapper';
import { DialogPanel, DialogTitle } from '@headlessui/react';

import { formatCurrency } from '../../libs/numberUtil';
import {PiSealCheckFill} from 'react-icons/pi';

const ViewTransaction = ({data,isOpen,setIsOpen}) => {
    function closeModal() {
        setIsOpen(false);
    }

    const longDateString = new Date(data?.createdat).toLocaleDateString("en-US", {
        dateStyle: "full",
    });

    const longTimeString = new Date(data?.createdat).toLocaleTimeString("en-US", {
        timeStyle: "short",
    });

    return(
        <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Transaction Details
                </DialogTitle>
                <div className='space-y-3'>
                    <div className='flex items-center gap-2 text-gray-600 border-gray-300 dark:text-gray-400 dark:border-gray-600'>
                        <p> {data?.source}</p>
                        <PiSealCheckFill size={20}/>
                    </div>    
                </div>

                <div className='mb-10'>
                    <p className='text-xl text-black dark:text-white'>
                        {data?.description}  
                    </p>
                    <span className = 'text-xs text-gray-600'>
                        {longDateString} {longTimeString}
                    </span>
                </div>

                <div className='mt-10 mb-3 flex justify-between'>
                    <p className='text-black dark:text-gray-400 text-2xl font-blod'>
                        <span className={`${data?.type === 'income' ? "text-emerald-500" : "text-red-500"} font-bold mgl-1`}>
                            {data?.type === 'income' ? "+" : "-"}
                        </span>
                        {formatCurrency(data?.amount)}
                    </p>

                    <button 
                        type='button'
                        className='rounded-md outline-none bg-violet-600 px-4 py-2 text-sm font-medium text-white'
                        onClick= {closeModal}>
                            Close
                    </button>
                </div>
            </DialogPanel>
        </DialogWrapper>
    )
}

export default ViewTransaction;
