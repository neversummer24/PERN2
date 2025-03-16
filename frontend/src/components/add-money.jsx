
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



const AddMoney = (
    { isOpen, setIsOpen, id,refetch }
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

   
    const [loading, setLoading] = useState(false);

    function closeModal() {
        setIsOpen(false);
    }

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const { data: res } = await api.put(`/account/add-money/${id}`, data);

            if (res?.data) {
                toast.success(res?.message);
                setIsOpen(false);
                refetch();
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
                        Add Money To Account
                    </DialogTitle>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Input
                            className="inputStyle"
                            disabled={loading}
                            type="number"
                            label="Amount"
                            name="amount"
                            errors={errors.amount ? errors.amount.message : ""}
                            {...register("amount", { required: "Amount is required" })}
                        />

                        <Button
                            disabled={loading}
                            type="submit"
                            className="bg-violet-700 text-white w-full mt-4">
                            {loading ? <BiLoader size={20} className="animate-spin" /> : "Add Money"}
                            Create Account
                        </Button>
                    </form>



                </DialogPanel>

            </DialogWrapper>
        </>
    )

}







export default AddMoney;
