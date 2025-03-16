import React from 'react'
import {BsCashCoin,BsCurrencyDollar} from 'react-icons/bs'
import {SiCashapp} from 'react-icons/si'


import {Card} from '../ui/card'

const ICON_STYLES =[
    "bg-blue-300 text-blue-800",
    "bg-emerald-300 text-emerald-800",
    "bg-rose-300 text-rose-800",

]

const Stat = ({dt}) =>{
    const  data = [
        {lable:"Total Balamce",
            amount:dt?.balance,
            increase:10.9,
            icon:<BsCurrencyDollar size={26}/>
        },
        {lable:"Total Income",
            amount:dt?.income,
            increase:8.9,
            icon:<BsCashCoin size={26}/>
        },
        {lable:"Total Expense",
            amount:dt?.expense,
            increase:-10.9,
            icon:<SiCashapp size={26}/>
        },
    ];

    const ItemCards = ({item,idnex}) => {
        return(
            <Card className="flex items-center justify-between w-full h-48 gap-5 px-4 py-12 shadow-lg 2xl:min-w-96 2xl:px-8 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <div className = "flex items-center gap-4 w-full h-full">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${ICON_STYLES[idnex]}`}
                >
                {item.icon}
                </div >

                <div className = "space-y-3">
                    <span className = "text-base text-gray-600 dark:text-gray-400 md:text-log">
                        {item.lable}
                    </span>
                    <p className ="text-2xl font-medium text-black 2xl:text-3xl dark:text-gray-400" >
                        {item?.amount || 0.0}
                    </p> 
                    <span className = "text-xs md:text-sm 2xl:text-base text-gray-600 dark:text-gray-400">  
                        Overall {item.lable}
                    </span> 
                </div>
            </div>
            </Card>      
        )
             
    };
    

    return(
        <div className="flex flex-col items-center justify-between gap-8 mb-20 md:flex-row 2xl:gap-x-40">
            <div className = "flex flex-col items-center justify-between w-full gap-10 md:flex-row 2xl:gap-20">
                {data.map((item,idnex) => <ItemCards item={item} idnex={idnex} key={idnex}/>)}
            </div>
        </div>
    );
       
    
    


};

export default Stat
   

