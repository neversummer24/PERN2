import  { useEffect } from 'react';
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '../../components/ui/card'
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import userStore  from '../../store/index';  
import { SocialAuth } from '../../components/ui/social-auth';
import { Seperator } from '../../components/ui/seperator';
import {Input} from '../../components/ui/input';
import {BiLoader} from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from "../../libs/authApiCall"


const signInSchema = z.object({
  email:z
        .string({required_error:"Email is required"})
        .email({message:"Invalid email address"}),
  password:z
        .string({required_error:"Password is required"})
        .min(6,{message:"Password must be at least 6 characters"})      
})

const SignIn = () => {
  const {user,setUser} = userStore((state) => state);


  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: zodResolver(signInSchema)});
  
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      console.log("onsubmit：",data);
      setLoading(true);
      const {data:res} = await api.post("/auth/sign-in", data);
      if(res?.user){
        console.log("sign in successfully");
        toast.success("Sign in successfully");

        const userInfo = {token: res?.token, ...res?.user};
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);

        setTimeout(() => {
          navigate("/dashboard");
        },1500)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }finally{
      setLoading(false);
    }
  } 

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className='flex items-center justify-center w-full min-h-screen py-10'>
      <Card className="w-[400px] bg-white dark:bg-black/20 shadow-md overflow-hidden">
        <div className='p-6 md:-8'>
          <CardHeader className='py-0'>
            <CardTitle className='mb-8 text-center dark:text-white'>Sign In</CardTitle>
          </CardHeader>

          <CardContent className='p-0'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='mb-8 space-y-6'>
                <SocialAuth isLoading={loading} setLoading={setLoading}/>
                <Seperator/>

                <Input
                disabled={loading}
                id="email"t
                label="Email"
                type="email"
                placeholder="Email"
                {...register("email")}
                error={errors.email?.message}
                className="text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700
                dark:text-gray-400 dark:outline-none"
                />
               

                <Input
                disabled={loading}
                id="password"
                label="Password"
                type="password"
                placeholder="Password"
                {...register("password")}
                error={errors.password?.message}  
                className="text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700
                dark:text-gray-400 dark:outline-none"
                />
              </div>

              <Button
                 type="submit"
                 className="w-full bg-violet-800 hover:bg-violet-900"
                 disabled={loading}>
                {loading ? <BiLoader className="text-2xl text-white animate-spin" /> : "Sign In"}
              </Button>

            </form>  
          </CardContent>
        </div>

        <CardFooter className='justify-center gap-2'>
          <p className='text-sm text-muted-foreground'>Don't have an account?</p>
          <Link 
            to="/sign-up" 
            className='text-sm font-semibold text-violet-500 hover:underline'
          >Sign Up</Link>
        </CardFooter>
        
      </Card>
    </div>
  )
}

export default SignIn
