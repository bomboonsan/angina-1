'use client';
import { useCookies } from 'next-client-cookies';
import Image from "next/image";
import Header from "@/components/Header";
import LangSwitch from "@/components/LangSwitch";
import Title from "@/components/Title";
import TitleSM from "@/components/TitleSM";
import AgeSex from "@/components/AgeSex";
import Question from "@/components/Question";
import QuestionList from "@/components/QuestionList";
import Skeleton from "@/components/Skeleton";
import Result from "@/components/Result";
import CacsBox from '@/components/CacsBox';

import CacsclInput from "@/components/CacsclInput";

import { useEffect, useState } from "react";

import { useRouter } from 'next/navigation'

import Swal from 'sweetalert2'

import adjust from '@/data/adjust.json'

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

    useEffect(() => {
        const RF_PTP_value = cookies.get('RF_PTP')
        if (!RF_PTP_value) {
            router.push('/')
        }
    }, []);

    const sendLang = (value) => {
        setLang(value);
    }

    const [totalScore , setTotalScore] = useState(0);
    const saveScore = (value) => {
        setTotalScore(totalScore + value);            
    }
    
    const saveCookies = (value) => {
        cookies.set('Adjust' , value);
        router.push('/secondary');
    }



    return (
        <>
            <main className="max-w-[500px] mx-auto bg-white shadow min-h-screen overflow-hidden app-wrapper relative">
            <Header />
            <div className="my-5 p-4">
                <LangSwitch props={{ sendLang: sendLang }} />
                <TitleSM props={{ title: 'Adjust clinical likelihood based on abnormal clinical findings' }} />
                <QuestionList props={{ sendData: saveScore , sendCookie : saveCookies , questions : adjust , lang: lang }} />
            </div>
            </main>
        </>
    );
}

