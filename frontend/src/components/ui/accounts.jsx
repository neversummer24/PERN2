import React from "react";
import { FaBtc,FaPaypal } from "react-icons/fa";
import {GiCash} from 'react-icons/gi'
import {RiVisaLine} from 'react-icons/ri'
import {Link} from 'react-router-dom'

import {formatCurrency, maskAccountNumber} from "../../libs/numberUtil";
import Title from "./title";

const ICONS  = {
    crypto:(<div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-venter rounded-full">
        <FaBtc size={26}/>
    </div>),
    cash:(<div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-venter rounded-full">
        <GiCash size={26}/>
    </div>),
    visa:(<div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-venter rounded-full">
        <RiVisaLine size={26}/>
    </div>),
    paypal:(<div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-venter rounded-full">
        <FaPaypal size={26}/>
    </div>)
}

const Accounts = ({data}) => {
    return (
        <div className ="mt-20 md:mt-0 py-5 md:py-20 w-full md:w-1/3">
            <Title>Accounts</Title>
            <Link to="/accounts" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white">See all</Link>

            <div className= "w-full">
                {data?.map((item,index) => (
                    <div key={index} className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-5">
                           <div>{ICONS[item?.account_name?.toLowerCase()]}</div>
                           <div>
                            <p className=" text-black  dark:text-gray-400 text-base 2xl:text-lg">{item?.account_name}</p>
                            <span className="text-sm 2xl:text-base text-gray-600">{maskAccountNumber(item?.account_number)}</span>
                           </div>
                        </div>
                        <div>
                            <p className ='text-lg 2xl:text-xl text-black dark:text-gray-400 font-medium'>{formatCurrency(item?.balance)}</p>
                            <span className = 'text-xs 2xl:text-sm text-gray-600 dark:text-violet-700'>Account Balance</span>
                        </div>
                    </div>
                ))} 
            </div>
        </div>

        

    )   
}
export default Accounts;