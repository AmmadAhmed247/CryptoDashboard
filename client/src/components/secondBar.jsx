import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react'
import { FaMoon, FaSun } from "react-icons/fa";

const SecondNavbar = () => {
    const [isNight, setIsNight] = useState(false)
    const {data}=useQuery({
        queryKey:["24hrliquidationData"],
        queryFn:async()=>{
            const res=await axios.get(`${import.meta.env.VITE_BACKEND}/api/liquidation/24hr`)
            return res.data
        },
        refetchInterval:1000,
    })
    const {data:volumeData }=useQuery({
        queryKey:["24hrVolume"],
        queryFn:async()=>{
            const res=await axios.get(`${import.meta.env.VITE_BACKEND}/api/liquidation/24hrvolume`)
            return res.data
        },
        refetchInterval:1000,
    })

    return (
        <div className="bg-zinc-800 border-b-2 px-2 py-1 border-zinc-700 sticky top-0 z-50">

            <div className="flex border-b-2 border-zinc-700 flex-row items-start sm:px-5 w-full h-fit py-2 xl:px-60 md:px-10 justify-between">
                <div className="flex gap-4 flex-row mr-12">
                    <span className=' cursor-pointer whitespace-nowrap   white text-sm'>24hr Volume : <span className='text-blue-500'>{Number(volumeData?.totalVolume).toLocaleString()}</span></span>
                    <span className=' cursor-pointer  whitespace-nowrap white  text-sm'>24hr Liquidation : <span className='text-blue-500'>${Number(data?.total24hrData).toLocaleString()} </span></span>
                    <span className=' cursor-pointer whitespace-nowrap  white  text-sm'>24hr Long/Short : <span className='text-blue-400'>{data ? `${data.longShortRatio}` : 'Loading...'}</span> </span>
                </div>
                <div className="flex flex-row items-start">
                    <button className=' cursor-pointer  text-lg active:scale-105 transition-all ' onClick={() => setIsNight(!isNight)}>
                        {isNight ? <FaMoon /> : <FaSun />}
                    </button>
                </div>
            </div>

            <div className="h-10  flex justify-between border-zinc-700 xl:px-60 md:px-10 sm:px-5  items-center ">
                <span className='font-bold   cursor-pointer w-fit text-zinc-100 font-mono transition-all active:scale-105 text-4xl'>RektWatch</span>
                <div className="flex flex-row max-[1500px]:hidden items-center gap-4">
                    <span className='font-semibold  cursor-pointer  text-zinc-100 font-mono transition-all active:scale-105 '>About</span>
                    <button className='font-semibold  cursor-pointer  bg-blue-500 rounded-md active:scale-105 px-2 py-1 font-mono transition-all' >Login</button>
                </div>
                <div className="block max-[1500px]:block min-[1501px]:hidden">
                    <button>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-8 h-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 5.75h16.5M3.75 12h16.5M3.75 18.25h16.5"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SecondNavbar