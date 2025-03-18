import React , {useEffect , useState }from 'react'
import { useSearchParams } from 'react-router-dom'
import {getDateSevenDaysAgo} from '../libs/numberUtil'

const DataRange = () => {
    const sevenDaysAgo = getDateSevenDaysAgo();

    const [searchParams, setSearchParams] = useSearchParams();

    const [startDate, setStartDate] = useState(()=>{
        const df = searchParams.get("df");

        return df && new Date(df).getTime() <= new Date().getTime() ? df: sevenDaysAgo 
        || new Date().toISOString().split("T")[0];                                                                                                                                                                     
    });

    const [endDate, setEndDate] = useState(()=>{
        const dt = searchParams.get("dt");

        return dt && new Date(dt).getTime() >= new Date().getTime() ? dt : new Date().toISOString().split("T")[0];
    });

    useEffect(()=>{
        setSearchParams({df: startDate, dt: endDate});
    },[startDate, endDate]);
    
    const handleStartDateChange = (e) => {
        const df = e.target.value;
        setStartDate(df);

        if(new Date(df).getTime() > new Date(endDate).getTime()){
            setEndDate(df);
        }
    }

    const handleEndDateChange = (e) => {
        const dt = e.target.value;
        setEndDate(dt);

        if(new Date(dt).getTime() < new Date(startDate).getTime()){
            setStartDate(dt);
        }
    }

    return(
        <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1'>
                <lable className='block text-gray-700 dark:text-gray-300 text-sm mb-2'
                    htmlFor='startDate'>
                    Start Date</lable>

                <input type="date" id="startDate" name = "startDate" 
                    value={startDate} max={endDate} onChange={handleStartDateChange}
                    className='inputStyles'/>   
            </div>   

            <div className='flex items-center gap-1'>
                <lable className='block text-gray-700 dark:text-gray-300 text-sm mb-2'
                    htmlFor='endDate'>
                    Start Date</lable>

                <input type="date" id="endDate" name = "endDate" 
                    value={endDate} min={startDate} onChange={handleEndDateChange}
                    className='inputStyles'/>   
            </div>     
        </div>
        
        
                
    )

}     

export default DataRange;
