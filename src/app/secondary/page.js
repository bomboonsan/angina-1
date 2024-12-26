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
    const [cacsScore , setCacsScore] = useState(0);
    const [cacs_cs , setCacs_cs] = useState(0);

    useEffect(() => {
        const RF_PTP_value = cookies.get('RF_PTP')
        if (!RF_PTP_value) {
            router.push('/')
        }
        if (RF_PTP_value) {
            setRF_PTP(RF_PTP_value);
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

    }



    return (
        <>
            <Header />
            <div className="my-5 p-4">
                <LangSwitch props={{ sendLang: sendLang }} />

                <CacsclInput props={{ sendCacsScore: sendCacsScore }} />

                <div>
                    <p>
                    RF_PTP <span className="ml-4">{RF_PTP}</span>
                    </p>
                    <p>
                        CACS CL  <span className="ml-4">{cacs_cs}</span>
                    </p>
                </div>
            </div>
        </>
    );
}

