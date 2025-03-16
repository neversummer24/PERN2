import {
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect
  } from "firebase/auth";

import React, {useEffect, useState} from 'react'
import {useAuthState}   from 'react-firebase-hooks/auth';
import {FcGoogle} from 'react-icons/fc'
import {FaGithub} from 'react-icons/fa'
import { useNavigate } from "react-router-dom";
import {toast} from 'sonner'
import api from "../../libs/authApiCall"
import {auth} from "../../libs/firebaseConfig"
import {Button} from "../ui/button"
import  userStore  from "../../store";
import { set } from "zod";


export const SocialAuth = ({isLoading,setLoading}) => {
    const [userFromFirebase] = useAuthState(auth);
    const [selectedProvider, setSelectedProvider] = useState("google");
    const setUser = userStore((state) => state.setUser);
    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        try {
          const provider = new GoogleAuthProvider();
          setSelectedProvider("google");
          const res = await signInWithPopup(auth, provider);
          console.log("signInWithGoogle res",res);
        } catch (error) {
          console.error("error sign in with google",error);
        }
    };
    
    const signInWithGithub = async () => {
        try {
            const provider = new GithubAuthProvider();
            setSelectedProvider("github");
            const res = await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("error sign in with github",error);
        }
    };

    useEffect(()=>{
        const saveUserInfo = async () => {
            try {
                const userData = {
                    name: userFromFirebase.displayName,
                    email: userFromFirebase.email,
                    uid: userFromFirebase.uid,
                    provider: selectedProvider,
                }

                setLoading(true);

                const {data:res} = await api.post("/auth/sign-in", userData);
                console.log("socail auth sign in res:",res);


                if(res?.user){
                    toast.success(res?.message);
                    const userInfo = {token: res?.user?.token, ...res?.user};

                    localStorage.setItem("user", JSON.stringify(userInfo));
                    setUser(userInfo);

                    setTimeout(() => {
                        navigate("/dashboard");
                    }, 1000);
                }
            } catch (error) {
                console.error("error in useEffect in sign up",error);
            } finally{
                setLoading(false);
            }
        };

        if(userFromFirebase){
            saveUserInfo();
        }

    },[userFromFirebase?.uid]);

    return(
        <div className="flex items-center gap-2">
            <Button 
                onClick={signInWithGoogle} 
                disabled={isLoading}
                variant='outline'
                className='w-full text-sm font-normal dark:bg-transparent dark:boarder-gray-800 dark:text-gray-400'
                type='button'> 
                   <FcGoogle className="mr-2 size-5" />Continue with Google
            </Button>       

             {/* <Button 
                onClick={signInWithGithub} 
                disabled={isLoading}
                variant='outline'
                className='w-full text-sm font-normal dark:bg-transparent dark:boarder-gray-800 dark:text-gray-400'
                type='button'> 
                   <FaGithub className="mr-2 size-5" />Github
            </Button>     */}
        </div>    
    )


   
}    