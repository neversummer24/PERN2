
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import userStore from '../store';
import { toast } from 'sonner';
import api from '../libs/authApiCall';
import { DialogWrapper } from './wrapper/dialog-wrapper';
import { DialogPanel, DialogTitle } from '@headlessui/react';
import { MdOutlineWarning } from 'react-icons/md';
import {Input} from './ui/input'
import {Button} from './ui/button'
import { BiLoader } from 'react-icons/bi';
import { formatCurrency } from '../libs/numberUtil';

const accounts = ["cash", "crypto", "visa", "paypal"];

const AddAccount = (
    { isOpen, setIsOpen, refetch }
) => {

    const user = userStore((state) => state.user);
    console.log("add acount user:"+user)
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            account_number: 123456,
        }
    });

    const [selectedAccount, setSelectedAccount] = useState("");
    const [loading, setLoading] = useState(false);

    function closeModal() {
        setIsOpen(false);
    }

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const { data: res } = await api.post("/account/create", data);

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

    return (
        <>
            <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-300 mb-4 uppercase">
                        Add Account
                    </DialogTitle>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className='flex flex-col gap-1 mb-6'>
                            <p className='text-gray-700 dark:text-gray-400 text-sm mb-2'>
                                Select Account                    </p>
                            <select
                                {...register("account_name", { required: "Account Name is required" })}
                                onChange={(e) => setSelectedAccount(e.target.value)}
                                className='bg-transparent appearance-none border border-gray-200 dark:border-gray-800 rounded
                    w-full py-2 px-3 text-gray-700 dark:text-gray-500 outline-none ring-blu-500 focus:ring-1 dark:placeholder::text-gray-700'>
                                {accounts.map((account, index) => (
                                    <option key={index} value={account}
                                        className='w-full flex items-center justify-center dark:bg-slate-900'>
                                        {account}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {user?.accounts?.includes(selectedAccount) && (
                            <div className='flex items-center gap-2 bg-yellow-400 text-black p-2 mt-6 rounded'>
                                <MdOutlineWarning size={30}/>
                                <span className='text-sm'>
                                    This type of account already activated.
                                </span>

                            </div>
                        )}   

                        {!user?.accounts?.includes(selectedAccount) && (
                            <>
                                <Input
                                    className="inputStyle"
                                    disabled={loading}
                                    label="Account Number"
                                    name="account_number"
                                    errors={errors.account_number ? errors.account_number.message : ""}
                                    {...register("account_number", { required: "Account Number is required" })}
                                />

                                <Input
                                    className="inputStyle"
                                    disabled={loading}
                                    type="number"
                                    label="Initial Amount"
                                    name="amount"
                                    errors={errors.amount ? errors.amount.message : ""}
                                    {...register("amount", { required: "Amount is required" })}
                                />

                                <Button
                                    disabled={loading}
                                    type="submit"
                                    className="bg-violet-700 text-white w-full mt-4">
                                    {`Submit ${
                                        watch("amount") ? formatCurrency(watch("amount")) : "0"
                                    }`}
                                </Button>
                            </>

                           

                        )}

                    </form>



                </DialogPanel>

            </DialogWrapper>
        </>
    )

}







export default AddAccount;
