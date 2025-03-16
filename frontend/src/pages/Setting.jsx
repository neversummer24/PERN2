import React from 'react'
import Title from '../components/ui/title';
import {SettingForm} from '../components/ui/setting-form';
import { ChangePassword } from '../components/ui/change-password';
import userStore from '../store';


const Setting = () => {
  const user = userStore((state) => state.user);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-4xl px-4 py-4 my-6 shadow-lg bg-gray-50 dark:bg-black/20 md:px-10 md:my-10">
        <div className="mt-6 border-b-2 border-gray-200 dark:border-gray-600">
          <Title title="General Settings" />
        </div>

        <div className="py-6">
          <p className="text-lg font-bold text-black dark:text-white">
            Profile Information
          </p>
          <div className="flex gap-4 my-8 items-center">
            <div className="text-xl flex items-center justify-center w-12 h-12 rounded-full text-white
            cursor-pointer bg-violet-600">
              <p>{user.firstname.charAt(0).toUpperCase()}</p>
            </div>
            <p className="text-xl font-semibold text-black dark:text-gray-400">{user.firstname}</p>
          </div>

          <SettingForm/>


          {!user?.provided && <ChangePassword/>}

        </div>
      </div>
    </div>
  )
}

export default Setting;
