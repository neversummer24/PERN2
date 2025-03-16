import React from 'react';
import { useForm } from 'react-hook-form';
import userStore from '../../store/index';
import { useState } from 'react';
import { Combobox, Transition, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { BsChevronExpand } from 'react-icons/bs';
import { Fragment } from 'react';
import { useEffect } from 'react';
import { fetchCountries } from '../../libs/fetchCountries';
import api from '../../libs/authApiCall';
import { toast } from 'sonner';
import { BiCheck, BiLoader } from 'react-icons/bi';
import { Input } from './input';
import { Button } from "./button";




export const SettingForm = () => {
  const { user, setUser, theme, setTheme } = userStore((state) => state);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      ...user
    }
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const newData = {
        ...data,
        country: selectedCountry?.country,
        currency: selectedCountry?.currency
      };

      const { data: res } = await api.put("/user", newData);

      if (res?.user) {
        toast.success("Profile updated successfully");
        const userInfo = { token: res?.user?.token, ...res?.user };
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const [selectedCountry, setSelectedCountry] = useState({
    country: user?.country, currency: user?.currency
  });

  const [query, setQueury] = useState("");
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleTheme = (value) => {
    setTheme(value);
    localStorage.setItem('theme', value);
  };

  const filteredCountries = query === "" ? countriesData : countriesData.filter((country) => {
    return country.country.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, ""));
  });

  const getCountriesData = async () => {
    const data = await fetchCountries();
    setCountriesData(data);
  }

  useEffect(() => {
    getCountriesData();
  }, []);

  const Countries = () => {
    return (
      <div className="w-full">
        <Combobox value={selectedCountry} onChange={setSelectedCountry}>
          <div className="relative mt-1">
            <div className="">
              <ComboboxInput
                className="inputStyles"
                displayValue={(country) => country?.country}
                onChange={(event) => setQueury(event.target.value)}
                placeholder="Select a country"
              />
              <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                <BsChevronExpand className="text-gray-400" />
              </ComboboxButton>
            </div>
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQueury('')}
          >
            <ComboboxOptions
             
              transition
              className="absolute mt-1 max-h-60 w-[var(--input-width)] [--anchor-gap:var(--spacing-1)] overflow-auto text-base bg-white dark:bg-gray-300
                   rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0">
              {filteredCountries.length === 0 && query !== "" ?
                (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-400">
                    Nothing found.
                  </div>)
                :
                (filteredCountries.map((country, index) => (
                  <ComboboxOption
                    key={country.country + index}
                    value={country}
                    className={({ focus }) => `relative cursor-default select_none py-2 pl-10 pr-4 
                          ${focus ? "bg-violet-600 text-white" : "text-gray-900 dark:text-gray-400"}`}
                  >
                    {({ selected,focus }) => (
                      <>
                        {selected && (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${focus ? "text-white" : "text-teal-600"}`}
                          >
                            <BiCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}

                        <div className="flex items-center gap-2">
                          <img className="w-6 h-6" src={country?.flag} alt={country.country} />
                          <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{country?.country}</span>
                        </div>
                      </>
                    )}
                  </ComboboxOption>

                ))
                )}

            </ComboboxOptions>
          </Transition>
        </Combobox>
      </div> 
    );
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full">
          <Input
            disabled={loading}
            className="inputStyle"
            lable="First Name"
            name="firstname" label="First Name" {...register("firstname", { required: "First name is required" })} error={errors?.firstname?.message} />
        </div>
        <div className="w-full">
          <Input className="inputStyle"
            disabled={loading}
            lable="Last Name"
            name="lastname" label="Last Name" {...register("lastname", { required: "Last name is required" })} error={errors?.lastname?.message} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full">
          <Input className="inputStyle"
            disabled={loading}
            name="email" label="Email" {...register("email", { required: "Email is required" })} error={errors?.email?.message} />
        </div>
        <div className="w-full">
          <Input className="inputStyle"
            disabled={loading}
            name="contact" label="Phone" {...register("contact", { required: "Contact is required" })} error={errors?.contact?.message} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full">
          <span className="lableStyles" >Country</span>
          <Countries />
        </div>
        <div className="w-full">
          <span className="lableStyles" >Currency</span>
          <select className="inputStyles">
            <option>{selectedCountry?.currency || user?.country}</option>
          </select>
        </div>
      </div>

      <div className="w-full flex items-center justify-between pt-10">
        <div>
          <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">Theme</p>
          <span className="labelStyles"> Customize your theme</span>
        </div>

        <div className="w-28 md:w-40">
          <select className="inputStyles" defaultValue={theme} onChange={(e) => toggleTheme(e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <div className="w-full flex items-center justify-between pb-10">
        <div>
          <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">Language</p>
          <span className="labelStyles"> Customize your Language</span>
        </div>

        <div className="w-28 md:w-40">
          <select className="inputStyles">
            <option value="English">English</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-6 pb-10 border-b-2 border-gray-200 dark:border-gray-600">
        <Button variant="outline"
          type="reset"
          disabled={loading}
          className="px-6 bg-transparent text-black dark:text-white border border-gray-300 dark:border-gray-600"
        >Reset</Button>

        <Button variant="default"
          type="submit"
          disabled={loading}
          className="px-6 bg-indigo-600 text-white hover:bg-indigo-700"
        >{loading ? <BiLoader className="animate-spin" text-white /> : "Save"}</Button>
      </div>

    </form>)

}




