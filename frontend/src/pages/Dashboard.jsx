import React, { useState,useEffect } from 'react'
import {toast} from 'sonner'
import Info from '../components/ui/info'
import Stat from '../components/ui/stat'
import Loading from '../components/ui/loading'
import api  from '../libs/authApiCall'
import Chart from '../components/ui/chart'
import CircleChart from '../components/ui/piechart'
import Accounts from '../components/ui/accounts'
import LastTransactions from '../components/ui/last-transactions'



const Dashboard = () => {
  const [data,setData] = useState([]);
  const [isLoading,setIsLoading] = useState(false);

  const getDashboardData = async () => {
    const URL = `/transaction/dashboard`;
    try{
      const {data:res} = await api.get(URL);
      setData(res.data);
    }catch(error){
      console.log(error);
      toast.error(error.message);
    }finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    getDashboardData();
  },[])

  if(isLoading){
    return <div className="flex items-center justify-center h-[80vh] w-full">
      <Loading/>
    </div> 
  } 

  return (
    <div className='px-0 md:px-5 2xl:px-20'>
      <Info title = "Dashboard" subTitle = "Monitor your financial health"/>
      <Stat dt={{
        balance:data?.availableBalance,
        income:data?.totalIncome,
        expense:data?.totalExpense
      }}
      />

      <div className ="flex flex-col-reverse items-center gap-10 w-full md:flex-row">
        <Chart data = {data?.monthlyData} />
         
          {data?.totalIncome>0 && (
            <CircleChart 
              dt={{
                balance:data?.availableBalance,
                income:data?.totalIncome,
                expense:data?.totalExpense
              }}
            />  
          )}
      </div>


      <div className="flex flex-col-reverse  gap-0  md:flex-row md:gap-10 2xl:gap-20">
           {data?.lastTransactions?.length>0 && <LastTransactions data = {data?.lastTransactions} /> }  
          {data?.lastAccounts?.length>0 && (
            <Accounts data = {data?.lastAccounts} />
          )}
      </div>

    </div>
  );
};

export default Dashboard
