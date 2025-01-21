'use client';
import { useCookies } from 'next-client-cookies';
import Image from "next/image";
import Header from "@/components/Header";
import LangSwitch from "@/components/LangSwitch";
import Title from "@/components/Title";
import AgeSex from "@/components/AgeSex";
import Question from "@/components/Question";
import QuestionList from "@/components/QuestionList";
import Skeleton from "@/components/Skeleton";
import Result from "@/components/Result";
import CacsBox from '@/components/CacsBox';

import CacsclInput from "@/components/CacsclInput";

import { useEffect, useState } from "react";

import { useRouter } from 'next/navigation'

export default function Secondary() {
    const router = useRouter();
    const cookies = useCookies();
    const [stateSection , setStateSection] = useState({
        start : true,
        symptom : false,
        questionSection_1_1 : false,
        questionSection_1_2 : false,        
        questionSection_2 : false,        
        showResult : false
    });
    const [lang , setLang] = useState('en');
    const [loading , setLoading] = useState(false);
    const [RF_PTP , setRF_PTP] = useState(30);
    const [RF_PTP_percent , setRF_PTP_percent] = useState(0);
    const [cacsScore , setCacsScore] = useState(0);
    const [cacs_cs , setCacs_cs] = useState(0);
    const [cacs_cs_percent , setCacs_cs_percent] = useState(0);

    useEffect(() => {
        const RF_PTP_value = cookies.get('RF_PTP')
        if (!RF_PTP_value) {
            router.push('/')
        }
        if (RF_PTP_value) {
            setRF_PTP(RF_PTP_value);
            setRF_PTP_percent(RF_PTP_value / 0.8);
        }
    }, []);

    const sendLang = (value) => {
        setLang(value);
    }
    const sendCacsScore = (value) => {
        setCacsScore(value);
        calculateCacs_cs(value);
    }

    // cacs_cs = 0.0013 + (RF_PTP * 0.2021) + (cacs_1_9*0.0082) + (cacs_10_99*0.0238) + (cacs_100_399*0.1131) + (cacs_400_999*0.2306) + (cacs_1000*0.4040) + (RF_PTP*cacs_1_9*0.1311) + (RF_PTP*cacs_10_99*0.2909) + (RF_PTP*cacs_100_399* 0.4077) + (RF_PTP*cacs_400_999*0.4658) + (RF_PTP*cacs_1000*0.4489)

    const calculateCacs_cs = (value) => {
        let result = 0;
        let cacs_1_9 = 0;
        let cacs_10_99 = 0;
        let cacs_100_399 = 0;
        let cacs_400_999 = 0;
        let cacs_1000 = 0;
        if (value <= 9) {
            cacs_1_9 = value;
            result = 0.0013 + (RF_PTP * 0.2021) + (value*0.0082);
        }
        else if (value <= 99) {
            cacs_10_99 = value;
            result = 0.0013 + (RF_PTP * 0.2021) + (cacs_10_99*0.0238);
        }
        else if (value <= 399) {
            cacs_100_399 = value;
            result = 0.0013 + (RF_PTP * 0.2021) + (cacs_100_399*0.1131);
        }
        else if (value <= 999) {
            cacs_400_999 = value;
            result = 0.0013 + (RF_PTP * 0.2021) + (cacs_400_999*0.2306);
        }
        else {
            cacs_1000 = value;
            result = 0.0013 + (RF_PTP * 0.2021) + (cacs_1000*0.4040);
        }

        // result = 0.0013 + (RF_PTP * 0.2021) + (cacs_1_9*0.0082) + (cacs_10_99*0.0238) + (cacs_100_399*0.1131) + (cacs_400_999*0.2306) + (cacs_1000*0.4040) + (RF_PTP*cacs_1_9*0.1311) + (RF_PTP*cacs_10_99*0.2909) + (RF_PTP*cacs_100_399* 0.4077) + (RF_PTP*cacs_400_999*0.4658) + (RF_PTP*cacs_1000*0.4489)
        result = result.toFixed(2);

        setCacs_cs(result);

        const resultPercent_80 = result / 0.8;
        setCacs_cs_percent(resultPercent_80);
        cookies.set('CACS' , resultPercent_80);

    }

    const submit = () => {        
        router.push('/record')
    }



    return (
        <>
            <Header />
            <div className="my-5 p-4">
                <LangSwitch props={{ sendLang: sendLang }} />

                <CacsclInput props={{ sendCacsScore: sendCacsScore }} />
                
                <div className='mt-10 relative'>
                    <Image
                        src="/img/graph2.png"
                        width={939}
                        height={355}
                        alt="Picture of the author"
                    />       
                    <div id='graph-area' className='absolute top-[43%] left-[59%] -translate-x-1/2 -translate-y-1/2 w-[38%] h-[76%] bg-neutral-600/30'>
                        <div 
                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[10%] h-auto aspect-square rounded-full bg-[#25215f]/70  hidden'
                            style={{
                                top: `${cacs_cs_percent}%`,
                                left: `${RF_PTP_percent}%`
                            }}
                        >
                        </div>
                    </div>
                </div>

                <CacsBox props={{ RF_PTP : RF_PTP , cacs_cs : cacs_cs }} />

                <div className='text-center mt-10'>
                    <button className="btn btn-primary btn-wide" onClick={submit}>SUBMIT</button>
                </div>
            </div>
        </>
    );
}

