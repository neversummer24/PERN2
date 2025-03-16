import React, { useEffect } from 'react'
import userStore from '../store';
import { useState } from 'react';
import { FaBtc, FaPaypal } from 'react-icons/fa';
import { GiCash } from 'react-icons/gi'
import { RiVisaLine } from 'react-icons/ri'
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../libs/authApiCall';
import { BiLoader } from 'react-icons/bi';
import Loading from '../components/ui/loading';
import { MdAdd, MdVerifiedUser } from 'react-icons/md';
import Title from '../components/ui/title';
import Accounts from '../components/ui/accounts';
import AccountMenu from '../components/ui/account-menu';
import { maskAccountNumber, formatCurrency } from '../libs/numberUtil';
import AddAccount from '../components/ui/add-account';
import AddMoney from '../components/ui/add-money';
import TransferMoney from '../components/ui/transfer-money';


const ICONS = {
  crypto: (<div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full">
    <FaBtc size={26} />
  </div>),
  cash: (<div className="w-12 h-12 bg-rose-600 text-white flex items-center justify-center rounded-full">
    <GiCash size={26} />
  </div>),
  visa: (<div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full">
    <RiVisaLine size={26} />
  </div>),
  paypal: (<div className="w-12 h-12 bg-purple-600 text-white flex items-center justify-center rounded-full">
    <FaPaypal size={26} />
  </div>)
}

const Account = () => {
  const user = userStore((state) => state.user);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTopup, setIsOpenTopup] = useState(false);
  const [isOpenTransfer, setIsOpenTransfer] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAccounts = async () => {
    try {
      const { data: res } = await api.get("/account");
      setData(res?.data);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenAddMoney = (account) => {
    setIsOpenTopup(true);
    setSelectedAccount(account?.id);
  }

  const handleOpenTransfer = (account) => {
    console.log("---transfer");
    setIsOpenTransfer(true);
    setSelectedAccount(account?.id);
  }

  useEffect(() => {
    setIsLoading(true);
    getAccounts();
  }, []);

  if (isLoading) {
    return <Loading />
  }

  return <>
    <div className='w-full py-10'>
      <div className='flex items-center justify-between'>
        <Title title="Accounts Information" />
        <div className='flex items-center gap-4'>
          <button
            onClick={() => setIsOpen(true)}
            className="py-1.5 px-2 rounded bg-black dark:bg-violet-600 text-white dark:text-white flex 
                items-center justify-center gap-2 border border-gray-500"
          >
            <MdAdd size={20} />
            <span className="">Add</span>
          </button>
        </div>
      </div>

      {data?.length === 0 ? (
        <div className="w-full flex items-center justify-center py-10">
          <span className="text-lg text-gray-600 dark:text-gray-400">
            You have no accounts yet
          </span>
        </div>
      ) : (
        <div className='w-full grid gird-cols-1 md:grid-cols-3 2xl:grid-cols-4 py-10 gap-6'>
          {
            data?.map((item, index) => (
              <div key={index} className='w-full h-48 flex gap-4 bg-gray-50 dark:bg-gray-800
                       dark:border-gray-700 dark:text-white rounded shadow p-3'>
                <div>
                  {ICONS[item?.account_name?.toLowerCase()]}
                </div>
                <div className='space-y-2 w-full'>
                  <div className="flex items-center justify-between">
                    <div className='flex items-center gap-1'>
                      <p className='text-lg text-gray-600 dark:text-gray-400'>{item?.account_name}</p>

                      <MdVerifiedUser size={26} className='text-emrald-600 ml-1' />
                    </div>

                    <AccountMenu
                      transferMoney={() => handleOpenTransfer(item)}
                      addMoney={() => handleOpenAddMoney(item)}
                    />
                  </div>

                  <span className="texet-gray-600 dark:text-gray-400 font-light leading-loose">
                    {maskAccountNumber(item?.account_number)}
                  </span>

                  <p className="text-xs text-gray-600 dark:text-gray-500">
                    {new Date(item?.createdat).toDateString()}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-base font-semibold text-black dark:text-gray-400">
                        {formatCurrency(item?.account_balance)}
                      </p>
                    
                    </div>
                  </div>


                </div>

              </div>
            ))
          }
        </div>

      )}
    </div>

    {/* dialog */}
    <AddAccount isOpen={isOpen} setIsOpen={setIsOpen} refetch={getAccounts} key={new Date().getTime()} />
    <AddMoney isOpen={isOpenTopup} setIsOpen={setIsOpenTopup} selectedAccount={selectedAccount}
      id={selectedAccount} refetch={getAccounts} key={new Date().getTime() + 1} />
    <TransferMoney isOpen={isOpenTransfer} setIsOpen={setIsOpenTransfer} selectedAccount={selectedAccount}
      id={selectedAccount} refetch={getAccounts} key={new Date().getTime() + 2} />
  </>


};

export default Account;
