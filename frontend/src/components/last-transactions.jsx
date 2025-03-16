import React from 'react'
import {IoCheckmarkDoneCircle} from 'react-icons/io5'
import {RiProgress3Line} from 'react-icons/ri'
import {TiWarning} from 'react-icons/ti'
import  {Link} from 'react-router-dom'
import Title from './ui/title'

const LastTransactions = (data) => {
    return(
        <div className="flex-1 w-full py-20">
            <div className="flex items-center justify-between">
                <Title title="Last transactions"/>
                <Link to="/transaction" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white">See all</Link>
            </div>

            <div className="mt-5 overflow-x-auto">
                <table className="w-full whitespace-nowrap">
                    <thead className="w-full boarder-b boarder-gray-300 dark:border-gray-600">
                        <tr className="text-left w-full text-black dark:text-gray-400">
                            <th className="px-2 py-2">Date</th>
                            <th className="px-2 py-2">Description</th>
                            <th className="px-2 py-2">Status</th>
                            <th className="px-2 py-2">Source</th>
                            <th className="px-2 py-2">Amount</th>
                        </tr>
                    </thead>

                    <tbody>
                        {Array.isArray(data) && data.length > 0 && data?.map((item,index) => (
                            <tr key={index} className="border-b border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                                <td className="py-4"> {new Date(item.createdAt).toLocaleDateString()} </td>

                                <td className="px-2 py-3"> {item?.description} </td>
                                <td className="flex items-center px-2 py-3 gap-2"> {
                                    item?.status==="pending" ? <RiProgress3Line className="text-yellow-500"/> : item?.status==="completed" ? <IoCheckmarkDoneCircle className="text-green-500"/> : <TiWarning className="text-red-500"/>} </td>
                                <td className="px-2 py-3"> 
                                   <p className='line-clamp-1'>{item?.source}</p>  </td>
                                <td className="flex items-center px-2 py-4 font-medium text-black dark:text-gray-400"> 
                                    <span className= {`${item?.type==="income" ? "text-green-500" : "text-red-500"}`}> {item?.type === "income" ? "+" : "-"} </span>
                                     {item?.amount} </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default LastTransactions;
                    

   