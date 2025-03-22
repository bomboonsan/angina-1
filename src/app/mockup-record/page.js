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

import React, { useEffect, useState , useRef } from "react";

import { useRouter } from 'next/navigation'

import domtoimage from 'dom-to-image';

import domToPdf from 'dom-to-pdf'

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function Record() {

    const router = useRouter();
    const cookies = useCookies();

    const [lang , setLang] = useState('en');
    const [loading , setLoading] = useState(false);
    const [RF_PTP , setRF_PTP] = useState(30);
    const [RF_PTP_percent , setRF_PTP_percent] = useState(0);
    const [cacsScore , setCacsScore] = useState(0);
    const [cacs_cs , setCacs_cs] = useState(0);
    const [cacs_cs_percent , setCacs_cs_percent] = useState(0);
    
    // report
    const [sex , setSex] = useState('');
    const [age , setAge] = useState('');
    const [symptom , setSymptom] = useState(null);
    const [Section1 , setSection1] = useState('');
    const [Section2 , setSection2] = useState('');
    const [CACS , setCACS] = useState('');
    
    const [Adjust , setAdjust] = useState('');

    const [finalSection1 , setFinalSection1] = useState(null);
    const [finalSection2 , setFinalSection2] = useState(null);
    const [finalAdjust , setFinalAdjust] = useState(null);

    // data var
    const ageRange = ["30-39", "40-49", "50-59", "60-69", "70-80"];

    useEffect(() => {
        const RF_PTP_value = cookies.get('RF_PTP')
        const sex = cookies.get('sex')
        const age = cookies.get('age')
        const symptom = cookies.get('symptom')
        const Section1 = cookies.get('Section1')
        const Section2 = cookies.get('Section2')
        const cacs_score = cookies.get('CACS_score')
        const CACS = cookies.get('CACS')
        const Adjust = cookies.get('Adjust')

        const lang = cookies.get('lang')
        if (lang) {
            setLang(lang)
        } else {
            setLang('en')
        }

        console.log('Section1', Section1);
        console.log('Section2', Section2);
        

        if (!RF_PTP_value || !sex || !age || !Section1 || !Section2 || !CACS) {
            router.push('/')
        }
        if (RF_PTP_value) {
            setRF_PTP(RF_PTP_value);
            setRF_PTP_percent(RF_PTP_value / 0.8);

            if (lang) {
                if (lang == 'th') {
                    setSex(sex == 'male' ? 'ชาย' : 'หญิง')
                } else {
                    setSex(sex == 'male' ? 'Male' : 'Female')
                }                
            } else {
                setSex(sex)
            }
            setAge(age)
            setSymptom(symptom)
            setSection1(Section1)
            setSection2(Section2)
            setCACS(CACS)
            setAdjust(Adjust)
            setCacsScore(Number(cacs_score))
        }
    }, []);

    useEffect(() => {
        if (Section1) {
            setFinalSection1(Section1.split(','));
        }
        if (Section2) {
            setFinalSection2(Section2.split(','));
        }
        if (Adjust) {
            setFinalAdjust(Adjust.split(','));
        }
    }, [Section1, Section2, Adjust]);

    const getRiskLevel = (value) => {
        if (value >= 0 && value <= 6) {
            if (lang == 'th') {
                return "ต่ำมาก";
            }
            return "Very low";
        }; // สีฟ้า
        if (value >= 7 && value <= 15) {
            if (lang == 'th') {
                return "ต่ำ";
            }
            return "Low";
        }; // สีเขียว
        if (value >= 16) {
            if (lang == 'th') {
                return "ปานกลาง";
            }
            return "Moderate";
        }; // สีเหลือง
        return "Unknown"; // กรณีไม่มีในช่วง
    };

    console.log('cacsScore', cacsScore)



    return (
        <>  
        <div className="max-w-[700px] mx-auto bg-white shadow min-h-screen overflow-hidden app-wrapper relative">
            <main id='record' className="my-0 p-2 py-0 bg-white mx-auto max-w-screen-md relative">
                <div className="relative z-0">
                    <div className="absolute -top-[25%] -left-2 w-32 h-32 z-0">
                        <img
                            src="/img/bg-l.png"
                            alt="AC"
                            className="w-full h-auto ml-auto block"
                        />
                    </div>
                    <div className="py-3 px-5">
                        <h1 className="text-[3vw] sm:text-lg font-semibold text-right leading-3 text-primary">
                            <span className="text-[2.3vw] sm:text-[0.9rem]">Risk Factor-weighted Clinical Likelihood model(RF-CL)</span>
                            <br/>
                            <span className="text-[2.5vw] sm:text-[0.9rem] text-[#c8a33a]">for Chronic Coronary Syndrome (2024 ESC)</span>
                        </h1>
                        
                    </div>
                    <div className="w-4/5 h-[5px] bg-gradient-to-r from-[#fbf7ec] to-[#f7f0df] content-[''] ml-auto rounded-full"></div>
                </div>

                <div className='space-y-4'>
                    <div className='record-box'>
                        <h2 className='text-lg font-bold text-primary mb-4 text-center'>Risk Factor-weighted Clinical Likelihood</h2>
                        
                        <section className="flex gap-10">
                            <div>
                                <p className=''>
                                    <span className='font-semibold'>
                                        Sex
                                    </span> : Male
                                    <span className='inline-block px-4'>|</span>
                                    <span className='font-semibold'>
                                        Age
                                    </span> : 40-49
                                </p>
                            </div>
                            <div className="hidden">
                                <div className="flex items-center gap-5">
                                    <p>
                                        <span className='font-semibold'>Name : </span>..........................................
                                    </p>
                                    <p>
                                        <span className='font-semibold'>HN : </span>................
                                    </p>
                                </div>
                            </div>
                        </section>
                        <hr className='mt-3' />
                        <section className="grid grid-cols-2 gap-4">

                            <div className='space-y-1 mt-4 text-sm'>
                                <div>
                                    <span className='mb-2 border border-secondary shadow-md font-semibold text-lg w-[150px] inline-flex items-center justify-center py-0.5 px-5 rounded-3xl bg-primary text-white'>
                                        {
                                            symptom == 'option1' && finalSection1 ? (
                                                <>Chest pain</>
                                            ) : (
                                                <>Dyspnoea</>
                                            )
                                        }
                                    </span>
                                </div>
                                {
                                    symptom == 'option1' && finalSection1 && (
                                        <div className='space-y-1 mt-4 '>
                                            <div className='recordCheckbox'>
                                                <input name='section1[]' type='checkbox' defaultChecked={finalSection1[0] != 0} readOnly />
                                                <label>
                                                    {
                                                        lang == 'th' ? 'เจ็บบริเวณกระดูกคอ, ขากรรไกร, ไหล่ หรือแขน' : 'Constricting discomfort located retrosternally or in neck, jaw, shoulder or arm'
                                                    }
                                                </label>
                                            </div>
                                            <div className='recordCheckbox'>
                                                <input name='section1[]' type='checkbox' defaultChecked={finalSection1[1] != 0} readOnly />
                                                <label>
                                                    {
                                                        lang == 'th' ? 'อาการเจ็บรุนแรงขึ้น เมื่อมีความเครียดและกังวล' : 'Aggravated by physical or emotional stress'
                                                    }
                                                </label>
                                            </div>
                                            <div className='recordCheckbox'>
                                                <input name='section1[]' type='checkbox' defaultChecked={finalSection1[2] != 0} readOnly />
                                                <label>
                                                    {
                                                        lang == 'th' ? 'อาการเจ็บบรรเทาลง เมื่อได้พักร่างกาย 5 นาที' : 'Relieved by rest or nitrates within 5 min '
                                                    }
                                                </label>
                                            </div>
                                            <div className='recordCheckbox'>
                                                <input name='section1[]' type='checkbox' defaultChecked={finalSection1[0] == 0 && finalSection1[1] == 0 && finalSection1[2] == 0} readOnly />
                                                <label>
                                                    {
                                                        lang == 'th' ? 'ไม่มีอาการ' : 'None'
                                                    }
                                                </label>
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    symptom == 'option2' && finalSection1 && (
                                        <div className='space-y-1 mt-4 '>
                                            <div className='recordCheckbox'>
                                                <input name='section1[]' type='checkbox' defaultChecked={finalSection1[0] != 0} readOnly />
                                                <label>
                                                    {
                                                        lang == 'th' ? 'มีอาการใจสั่นและ/หรือหายใจลำบากรุนแรง เมื่อต้องออกแรง' : 'Shortness of breath and/or trouble catching breath aggravated by physical exertion '
                                                    }
                                                </label>
                                            </div>
                                            <div className='recordCheckbox'>
                                                <input name='section1[]' type='checkbox' defaultChecked={finalSection1[0] == 0} readOnly />
                                                <label>
                                                    {
                                                        lang == 'th' ? 'ไม่มีอาการ' : 'None'
                                                    }
                                                </label>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            {/* <hr className='my-3' /> */}
                            <div className='space-y-1 mt-4 text-sm'>
                                <div>
                                    <span className='mb-2 border border-secondary shadow-md font-semibold text-lg w-[250px] inline-flex items-center justify-center py-0.5 px-5 rounded-3xl bg-primary text-white'>
                                    Risk Factor for CAD
                                    </span>
                                </div>
                                {
                                    finalSection2 && (
                                <>
                                <div className='recordCheckbox'>
                                    <input type='checkbox' defaultChecked={finalSection2[0] != 0} readOnly />
                                    <label>
                                        {
                                            lang == 'th' ? 'มีญาติสาย 1 คนขึ้นไป ที่มีประวัติโรคหลอดเลือดหัวใจ' : 'Family history (1 or more first-degree relatives with early signs of CAD (men less 55 and women less 65 years of age))'
                                        }
                                    </label>
                                </div>
                                <div className='recordCheckbox'>
                                    <input type='checkbox' defaultChecked={finalSection2[1] != 0} readOnly />
                                    <label>
                                        {
                                            lang == 'th' ? 'สูบบุหรี่' : 'Smoking (as Current or past smoker)'
                                        }
                                    </label>
                                </div>
                                <div className='recordCheckbox'>
                                    <input type='checkbox' defaultChecked={finalSection2[2] != 0} readOnly />
                                    <label>
                                        {
                                            lang == 'th' ? 'ภาวะไขมันในเลือดสูง' : 'Dyslipidaemia'
                                        }
                                    </label>
                                </div>
                                <div className='recordCheckbox'>
                                    <input type='checkbox' defaultChecked={finalSection2[3] != 0} readOnly />
                                    <label>
                                        {
                                            lang == 'th' ? 'โรคความดันโลหิตสูง' : 'Hypertension'
                                        }
                                    </label>
                                </div>
                                <div className='recordCheckbox'>
                                    <input type='checkbox' defaultChecked={finalSection2[4] != 0} readOnly />
                                    <label>
                                        {
                                            lang == 'th' ? 'โรคเบาหวาน' : 'Diabetes'
                                        }
                                    </label>
                                </div>
                                <div className='recordCheckbox'>
                                    <input type='checkbox' defaultChecked={finalSection2[0] == 0 && finalSection2[1] == 0 && finalSection2[2] == 0 && finalSection2[3] == 0 && finalSection2[4] == 0} readOnly />
                                    <label>
                                        {
                                            lang == 'th' ? 'ไม่มี' : 'None of Above'
                                        }
                                    </label>
                                </div>
                                </>
                                )
                                }
                            </div>

                        </section>
                        

                    </div>

                    <div className='my-2'>
                        <img 
                            src="/img/score-board.png"
                            alt="score-board"
                            width={900}
                            height={400}
                            className="block aspect-[1097/388] w-full"
                        />
                    </div>

                    <div className="p-5 py-10 bg-primary text-white rounded-xl">
                        <div className="flex flex-row gap-5 items-center justify-center">
                            <div>
                                <p className="text-xl font-medium text-center">
                                Clinical likelihood
                                </p>
                                <p className={RF_PTP < 7 ? "text-3xl font-bold text-center text-[#74b8e4]" : RF_PTP >= 7 && RF_PTP < 17 ? "text-3xl font-bold text-center text-[#45bc8d]" : RF_PTP >= 17 ? "text-3xl font-bold text-center text-[#c7c246]" : "" }>{getRiskLevel(RF_PTP)}</p>
                            </div>
                            <div>
                                <div className="flex flex-row gap-5 items-center justify-center">
                                    <div>
                                    <img 
                                        src="/img/hearth.png"
                                        alt="hearth"
                                        width={400}
                                        height={400}
                                        className="h-24 w-auto block"
                                    />
                                    </div>
                                    <div className="flex-initial">                                                                           
                                        <div className="text-center">
                                            <span className={RF_PTP < 7 ? "inline-flex aspect-square items-center justify-center text-3xl bg-[#74b8e4] text-white w-24 h-24 rounded-full" : RF_PTP >= 7 && RF_PTP < 17 ? "inline-flex aspect-square items-center justify-center text-3xl bg-[#45bc8d] text-white w-24 h-24 rounded-full" : RF_PTP >= 17 ? "inline-flex aspect-square items-center justify-center text-3xl bg-[#c7c246] text-white w-24 h-24 rounded-full" : "" }>
                                                {RF_PTP} <span className='text-base'>%</span>
                                            </span>
                
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    

                    <div className='record-box'>
                        <div className="mt-3">
                            <span className='mb-7 border border-secondary shadow-md font-semibold text-lg flex items-center justify-center py-1.5 px-5 rounded-3xl bg-primary text-white'>
                                Adjust clinical likelihood based on abnormal clinical findings
                            </span>
                        </div>
                        {
                            finalAdjust && (
                                <>
                                
                                    <div className="mb-3">
                                        {/* <img src="/img/test-mockup-01.jpg" alt="graph2" width={939} height={355} className="block my-8" /> */}
                                        <div className='recordCheckbox'>
                                            <input type='checkbox' defaultChecked={finalAdjust[0] != 0} readOnly />
                                            <label>
                                                Resting ECG changes (Q-wave or ST-segment/T-wave changes)
                                            </label>
                                        </div>
                                        <div className='recordCheckbox'>
                                            <input type='checkbox' defaultChecked={finalAdjust[1] != 0} readOnly />
                                            <label>
                                                Exercise ECG with abnormal findings
                                            </label>
                                        </div>
                                        <div className='recordCheckbox'>
                                            <input type='checkbox' defaultChecked={finalAdjust[2] != 0} readOnly />
                                            <label>
                                                LV dysfunction (severe or segmental)
                                            </label>
                                        </div>
                                        <div className='recordCheckbox'>
                                            <input type='checkbox' defaultChecked={finalAdjust[3] != 0} readOnly />
                                            <label>
                                                Ventricular arrhythmia
                                            </label>
                                        </div>
                                        <div className='recordCheckbox'>
                                            <input type='checkbox' defaultChecked={finalAdjust[4] != 0} readOnly />
                                            <label>
                                                Peripheral artery disease
                                            </label>
                                        </div>
                                        <div className='recordCheckbox'>
                                            <input type='checkbox' defaultChecked={finalAdjust[5] != 0} readOnly />
                                            <label>
                                                Coronary calcification on pre-existing chest CT
                                            </label>
                                        </div>
                                        <div className='recordCheckbox'>
                                            <input type='checkbox' defaultChecked={finalAdjust[6] != 0} readOnly />
                                            <label>
                                                None
                                            </label>
                                        </div>

                                    </div>

                                </>
                            )
                        }

                        <h2 className='text-lg font-bold text-primary mb-4 hidden'>
                            {
                                lang == 'th' ? 'Consider reclassification of low RF-CL' : 'Adjust clinical likelihood based on abnormal clinical findings'
                            }
                        </h2>
                        {/* <div>
                            <span className='mb-7 border border-secondary shadow-md font-semibold text-lg flex items-center justify-center py-1.5 px-5 rounded-3xl bg-primary text-white'>
                                Adjust clinical likelihood based on abnormal clinical findings
                            </span>
                        </div> */}
                        <div className='relative'>
                            <img
                                className="block my-8"
                                src="/img/graph2.png"
                                width={939}
                                height={355}
                                alt="Picture of the author"
                            />
                            {
                                cacsScore == 0 && (
                                    <div className='absolute -translate-x-1/2 -translate-y-1/2 top-[43%] left-[92%] w-[16%] h-auto aspect-[12/2] bg-red-500/50 rounded-3xl'></div>
                                )
                            }
                            {
                                cacsScore < 10 && cacsScore > 0 && (
                                    <div className='absolute -translate-x-1/2 -translate-y-1/2 top-[36%] left-[92%] w-[16%] h-auto aspect-[12/2] bg-red-500/50 rounded-3xl'></div>
                                )
                            }
                            {
                                cacsScore < 99 && cacsScore > 10 && (
                                    <div className='absolute -translate-x-1/2 -translate-y-1/2 top-[29%] left-[92%] w-[16%] h-auto aspect-[12/2] bg-red-500/50 rounded-3xl'></div>
                                )
                            }
                            {
                                cacsScore < 400 && cacsScore > 99 && (
                                    <div className='absolute -translate-x-1/2 -translate-y-1/2 top-[22%] left-[92%] w-[16%] h-auto aspect-[12/2] bg-red-500/50 rounded-3xl'></div>
                                )
                            }
                            {
                                cacsScore < 1000 && cacsScore > 400 && (
                                    <div className='absolute -translate-x-1/2 -translate-y-1/2 top-[15%] left-[92%] w-[16%] h-auto aspect-[12/2] bg-red-500/50 rounded-3xl'></div>
                                )
                            }
                            {
                                cacsScore > 1000 && (
                                    <div className='absolute -translate-x-1/2 -translate-y-1/2 top-[8%] left-[92%] w-[16%] h-auto aspect-[12/2] bg-red-500/50 rounded-3xl'></div>
                                )
                            }
                        </div>
                        {/* <div className='mt-4 grid grid-cols-2 gap-4'>
                            <div className='p-4 shadow-md rounded-lg border border-neutral-100 bg-white text-primary'>
                                <p className='text-center'>
                                    <span className='font-semibold text-center block text-secondary'>CACS CL</span>  
                                    <span className="ml-4 text-4xl font-bold">{CACS} %</span>
                                </p>
                            </div>
                            <div className='p-4 shadow-md rounded-lg border border-neutral-100 bg-white text-primary'>
                                <p className='text-center'>
                                    <span className='font-semibold text-center block text-secondary'>RF_PTP</span> 
                                    <span className="ml-4 text-4xl font-bold">{RF_PTP} %</span>
                                </p>
                            </div>
                        </div> */}
                        <div className="mt-4 space-y-5">
                            <div className="p-5 py-10 bg-primary text-white rounded-xl relative">
                                <div className="absolute -top-[10px] right-[5px] px-3 py-1 bg-yellow-300 rounded-lg shadow-md shadow-black/70 text-primary text-sm">
                                    <span className="font-semibold">Increase</span>
                                </div>
                                <div className="flex flex-row gap-5 items-center justify-center">
                                    <div className="min-w-[170px]">
                                        <p className="text-xl font-medium text-center">
                                        CACS CL
                                        </p>
                                        <p className={CACS < 7 ? "text-3xl font-bold text-center text-[#74b8e4]" : CACS >= 7 && CACS < 17 ? "text-3xl font-bold text-center text-[#45bc8d]" : CACS >= 17 ? "text-3xl font-bold text-center text-[#c7c246]" : "" }>{getRiskLevel(CACS)}</p>
                                    </div>
                                    <div>
                                        <div className="flex flex-row gap-5 items-center justify-center">
                                            <div>
                                            <img 
                                                src="/img/hearth.png"
                                                alt="hearth"
                                                width={400}
                                                height={400}
                                                className="h-24 w-auto block"
                                            />
                                            </div>
                                            <div className="flex-initial">                                                                           
                                                <div className="text-center">
                                                    <span className={CACS < 7 ? "inline-flex aspect-square items-center justify-center text-3xl bg-[#74b8e4] text-white w-24 h-24 rounded-full" : CACS >= 7 && CACS < 17 ? "inline-flex aspect-square items-center justify-center text-3xl bg-[#45bc8d] text-white w-24 h-24 rounded-full" : CACS >= 17 ? "inline-flex aspect-square items-center justify-center text-3xl bg-[#c7c246] text-white w-24 h-24 rounded-full" : "" }>
                                                        {CACS} <span className='text-base'>%</span>
                                                    </span>
                        
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 py-10 bg-primary text-white rounded-xl">
                                <div className="flex flex-row gap-5 items-center justify-center">
                                    <div className="min-w-[170px]">
                                        <p className="text-xl font-medium text-center">
                                        RF_PTP
                                        </p>
                                        <p className={RF_PTP < 7 ? "text-3xl font-bold text-center text-[#74b8e4]" : RF_PTP >= 7 && RF_PTP < 17 ? "text-3xl font-bold text-center text-[#45bc8d]" : RF_PTP >= 17 ? "text-3xl font-bold text-center text-[#c7c246]" : "" }>{getRiskLevel(RF_PTP)}</p>
                                    </div>
                                    <div>
                                        <div className="flex flex-row gap-5 items-center justify-center">
                                            <div>
                                            <img 
                                                src="/img/hearth.png"
                                                alt="hearth"
                                                width={400}
                                                height={400}
                                                className="h-24 w-auto block"
                                            />
                                            </div>
                                            <div className="flex-initial">                                                                           
                                                <div className="text-center">
                                                    <span className={RF_PTP < 7 ? "inline-flex aspect-square items-center justify-center text-3xl bg-[#74b8e4] text-white w-24 h-24 rounded-full" : RF_PTP >= 7 && RF_PTP < 17 ? "inline-flex aspect-square items-center justify-center text-3xl bg-[#45bc8d] text-white w-24 h-24 rounded-full" : RF_PTP >= 17 ? "inline-flex aspect-square items-center justify-center text-3xl bg-[#c7c246] text-white w-24 h-24 rounded-full" : "" }>
                                                        {RF_PTP} <span className='text-base'>%</span>
                                                    </span>
                        
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>


                    <div className='text-center mt-10 grid grid-cols-2 gap-3 px-3'>
                        <button className="btn btn-primary w-full">
                            {
                                lang == 'th' ? 'บันทึกรูปภาพ' : 'SAVE IMG'
                            }
                        </button>
                        <button className="btn btn-primary w-full">
                            {
                                lang == 'th' ? 'บันทึกเป็น PDF' : 'SAVE PDF'
                            }
                        </button>
                    </div>

                </div>
            </main>
        </div>
        </>
    );
}

