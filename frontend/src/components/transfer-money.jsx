
import { useEffect, useState } from 'react';
import { get, useForm } from 'react-hook-form';
import userStore from '../store';
import { toast } from 'sonner';
import api from '../libs/authApiCall';
import { DialogWrapper } from './wrapper/dialog-wrapper';
import { DialogPanel, DialogTitle } from '@headlessui/react';
import { MdOutlineWarning } from 'react-icons/md';
import { Input } from './ui/input'
import { Button } from './ui/button'
import { BiLoader } from 'react-icons/bi';
import Loading from './ui/loading';
import { formatCurrency } from '../libs/numberUtil';

const accounts = ["cash", "crypto", "visa", "paypal"];

const TransferMoney = (
    { isOpen, setIsOpen, refetch }
) => {

    const user = userStore((state) => state.user);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
    });


    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [accountData, setAccountData] = useState([]);
    const [fromAccount, setFromAccount] = useState("");
    const [toAccount, setToAccount] = useState("");

    function closeModal() {
        setIsOpen(false);
    }

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            const newData = {
                ...data,
                fromAccount: fromAccount.id,
                toAccount: toAccount.id,
            }

            const { data: res } = await api.put("/transaction/transfer-money", newData);

            if (res?.status === "success") {
                toast.success(res?.message);
                refetch();
                closeModal();
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const getAccounts = async () => {
        try {
            const { data: res } = await api.get("/account");
            setAccountData(res?.data);
            console.log(accountData)
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const getAccountBalance = (setAccount, val) => {
        const account = accountData?.find((account) => account.account_name === val);
        setAccount(account);
    }

    useEffect(() => {
        getAccounts();
    }, []);

    


    return (
        <>
            <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-300 mb-4 uppercase">
                        Transfer Money
                    </DialogTitle>

                    {isLoading ? (<Loading />) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className='flex flex-col gap-1 mb-2'>
                                <p className='text-gray-700 dark:text-gray-400 text-sm mb-2'>
                                    From Account                    </p>
                                <select
                                    onChange={(e) => getAccountBalance(setFromAccount, e.target.value)}
                                    className="inputStyles">

                                    <option disabled selected className='w-full flex items-center justify-center dark:bg-slate-900'>
                                        Select Account
                                    </option>    
                                    {accountData.map((account, index) => (
                                        <option 
                                            key={index} 
                                            value={account.account_name}
                                            className='w-full flex items-center justify-center dark:bg-slate-900'>
                                            {account.account_name}  {" - "}  {formatCurrency(account.account_balance)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='flex flex-col gap-1 mb-2'>
                                <p className='text-gray-700 dark:text-gray-400 text-sm mb-2'>
                                    To Account                    </p>
                                <select
                                    onChange={(e) => getAccountBalance(setToAccount, e.target.value)}
                                    className="inputStyles">

                                    <option disabled selected className='w-full flex items-center justify-center dark:bg-slate-900'>
                                        Select Account
                                    </option>

                                    {accountData.map((account, index) => (
                                        <option 
                                            key={index} 
                                            value={account.account_name}
                                            className='w-full flex items-center justify-center dark:bg-slate-900'>
                                            {account.account_name}  {" - "}  {formatCurrency(account.account_balance)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Input
                            className="inputStyle"
                            disabled={loading}
                            type="number"
                            label="Amount" 
                            name="amount"
                            placeholder="10"
                            errors={errors.amount ? errors.amount.message : ""}
                            {...register("amount", { required: "Amount is required" })}
                            />

                            { fromAccount && toAccount && fromAccount === toAccount && (
                                <div className='flex items-center gap-2 bg-yellow-400 text-black p-2 mt-6 rounded'>
                                    <MdOutlineWarning size={30}/>
                                    <span className='text-sm'>
                                        You cannot transfer money to the same account.
                                    </span>
                                </div>
                            )}

                            {fromAccount.account_balance < watch("amount") && (
                                  <div className='flex items-center gap-2 bg-yellow-400 text-black p-2 mt-6 rounded'>
                                  <MdOutlineWarning size={30}/>
                                  <span className='text-sm'>
                                      You do not have enough balance to transfer.
                                  </span>
                              </div>
                            )}



                            <Button
                                    disabled={loading}
                                    type="submit"
                                    className="bg-violet-700 text-white w-full mt-4">
                                    {`Transfer ${
                                        watch("amount") ? formatCurrency(watch("amount")) : ""
                                    }`}
                            </Button>

                        </form>
                    )}





                </DialogPanel>

            </DialogWrapper>
        </>
    )

}







export default TransferMoney;
