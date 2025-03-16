import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "../libs/authApiCall";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { BiLoader } from 'react-icons/bi';
import { Button } from "./ui/button";


export const ChangePassword = () => {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();

    const [loading, setLoading] = useState(false);

    const submitPasswordHandler = async (data) => {
        try {
            setLoading(true);
            const { data: res } = await api.put("/user/password", data);

            if (res?.status === "success") {
                toast.success(res?.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return <div className="py-6">
        <form onSubmit={handleSubmit(submitPasswordHandler)}>
            <div className="">
                <p className="text-xl font-bold text-black dark:text-white mb-3">
                    Change Password
                </p>
                <span className="lableStyles">
                    This will be used to log into your account for security reasons.
                </span>

                <div className="mt-6 space-y-6">
                    <Input
                        className="inputStyle"
                        disabled={loading}
                        type="password"
                        label="Current Password"
                        name="currentPassword"
                        errors={errors}
                        {...register("currentPassword", { required: "Current Password is required" })}
                    />

                    <Input
                        className="inputStyle"
                        disabled={loading}
                        type="password"
                        label="New Password"
                        name="newPassword"
                        errors={errors}
                        {...register("newPassword", { required: "New Password is required" })}
                    />

                    <Input
                        className="inputStyle"
                        disabled={loading}
                        type="password"
                        label="Confirm Password"
                        name="confirmPassword"
                        errors={errors}
                        {...register("confirmPassword",
                            {
                                required: "Confirm Password is required",
                                validate: (value) => {
                                    const newPassword = getValues("newPassword");
                                    if (value !== newPassword) {
                                        return "Password does not match";
                                    }
                                }
                            }
                        )
                        }
                    />

                    <div className="flex items-center justify-end mt-10 gap-6 pb-10 border-b-2 border-gray-200 dark:border-gray-600">
                        <Button variant="outline"
                            type="reset"
                            disabled={loading}
                            className="px-6 bg-transparent text-black dark:text-white border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        >Reset</Button>

                        <Button variant="default"
                            type="submit"
                            disabled={loading}
                            className="px-6 bg-indigo-600 text-white hover:bg-indigo-700"
                        >{loading ? <BiLoader className="animate-spin" text-white /> : "Save"}</Button>
                    </div>


                </div>


            </div>
        </form>

    </div>;
};