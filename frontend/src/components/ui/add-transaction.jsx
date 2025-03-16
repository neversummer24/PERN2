import { DialogWrapper } from '../wrapper/dialog-wrapper';
import { DialogPanel, DialogTitle } from '@headlessui/react';

import { formatCurrency } from '../../libs/numberUtil';
import {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import {MdOutlineWarning} from 'react-icons/md';
import {toast} from 'sonner';
import api from '../../libs/authApiCall';
import Loading from '../ui/loading';
import { Input } from './input';
import userStore from '../../store';
import { Button } from './button';


const AddTransaction = ({isOpen,setIsOpen,refetch}) => {
    const user = userStore((state) => state.user);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [accountData, setAccountData] = useState([]);
    const [account , setAccount] = useState({});
    const [accountBalance, setAccountBalance] = useState(0);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const newData = {
                ...data,
                source:account.account_name
            }

            const { data: res } = await api.post(`/transaction/add-transaction/${account.id}`, newData);
            if (res?.status === "success") {
                toast.success(res?.message);
                refetch();
                closeModal();
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
            if (error?.response?.data?.status === "auth_failed") {
                localStorage.removeItem("user");
                window.location.reload();
            }
        } finally {
            setLoading(false);
        }
    };

    const getAccountBalance = (accountName) =>{
        const account = accountData?.find((account) => account.account_name === accountName);
        setAccount(account);
        setAccountBalance(account?.account_balance);
    }

    const getAccounts = async () => {
        try {
            const { data: res } = await api.get("/account");
            setAccountData(res?.data);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        getAccounts();
    },[]);
    

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
                    Add Transaction
                </DialogTitle>
                
                {isLoading ? (<Loading/>) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='flex lfex-col gap-1 mb-2'>
                            <p className='text-gray-600 dark:text-gray-400 text-sm mb-2'>Select Account</p>
                            <select {...register("account_number")} onChange={(e) => getAccountBalance(e.target.value)} className='inputStyles'>
                                <option disabled selected className='w-full flex items-center justify-center dark:bg-slate-700'>Select Account</option>
                                {accountData?.map((account,index) => (
                                    <option key={index} value={account.account_name}
                                    className='w-full flex items-center justify-center dark:bg-slate-700'>
                                        {account.account_name} {" - "} {formatCurrency(account?.account_balance
                                            ,user?.country?.currency
                                        )}</option>
                                    
                                ))}
                            </select>
                        </div>

                        {accountBalance <=0 && (
                            <div className='flex items-center gap-2 bg-yellow-400 text-black p-2 mt-6 rounded'>
                            <MdOutlineWarning size={30}/>
                            <span className='text-sm'>
                                You do not have enough balance to transfer.
                            </span>
                           </div>
                        )}

                        {accountBalance > 0 && (
                            <>
                                <Input 
                                    name = 'description'
                                    lable = 'Description'
                                    register = {register}
                                    placeHolder = 'Description'
                                    errors={errors.description ? errors.description.message : ""}
                                    {...register("description", { required: "Description is required" })}
                                />

                                <Input
                                    name = 'amount'
                                    lable = 'Amount'
                                    type= "number"
                                    placeHolder = 'Amount'
                                    errors={errors.amount ? errors.amount.message : ""}
                                    {...register("amount", { required: "Amount is required" })}    
                                />    

                                <div className ='w-full mt-8'>
                                    <Button 
                                        type="submit"
                                        loading={loading}
                                        claaName='bg-violet-700 text-white w-full'
                                    >
                                        {`Confirm ${watch("amount")} ${user?.country?.currency} `}
                                    </Button>    
                                </div>
                                 
                            </>
                        )}
                       
                    </form>



                )}
            </DialogPanel>
        </DialogWrapper>
    )
}

export default AddTransaction;
