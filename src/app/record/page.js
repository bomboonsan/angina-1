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


    const captureDivAsImage = (time) => {
        const element = document.getElementById('record');
        const hiddenForImage = document.getElementById('hiddenForImage');
        hiddenForImage.classList.add('hidden');
        
        if (element) {
            domtoimage.toPng(element)
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `recorded-1-${time}.png`;
                link.click();
            })
            .finally(() => {
                hiddenForImage.classList.remove('hidden');                
            })
            .catch((error) => {
                console.error('Error capturing image:', error);
            });
        }
    };

    const save = () => {
        const time = new Date().getTime();
        captureDivAsImage(time);
    }

    console.log('finalAdjust', finalAdjust)



    return (
        <>  
        <div className="max-w-[700px] mx-auto bg-white shadow min-h-screen overflow-hidden relative">
            <main id='record' className="my-0 p-2 py-0 bg-white mx-auto max-w-screen-md relative app-wrapper">
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
                                        {
                                            lang == 'th' ? 'เพศ' : 'Sex'
                                        }
                                    </span> : {sex} 
                                    <span className='inline-block px-4'>|</span>
                                    <span className='font-semibold'>
                                        {
                                            lang == 'th' ? 'อายุ' : 'Age'
                                        }
                                    </span> : {ageRange[age-1]}
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
                                    <span className='mb-2 border border-secondary shadow-md font-semibold text-[0.65rem] lg:text-base lg:w-[250px] inline-flex items-center justify-center py-0.5 px-3 lg:px-5 rounded-3xl bg-primary text-white'>
                                        {
                                            symptom == 'option1' && finalSection1 ? (
                                                <>Chest pain characteristics</>
                                            ) : (
                                                <>Dyspnoea characteristics</>
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
                            <div className='space-y-1 mt-4 text-sm'>
                                <div>
                                    <span className='mb-2 border border-secondary shadow-md font-semibold text-[0.65rem] lg:text-base lg:w-[250px] inline-flex items-center justify-center py-0.5 px-3 lg:px-5 rounded-3xl bg-primary text-white'>
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

                    <div className="p-2 lg:p-5 py-4 lg:py-10 bg-primary text-white rounded-xl">
                        <div className="flex flex-row gap-5 items-center justify-center">
                            <div>
                                <p className="text-[1rem] lg:text-xl font-medium text-center">
                                Clinical likelihood
                                </p>
                                <p className={RF_PTP < 7 ? "text-[1.2rem] lg:text-3xl font-bold text-center text-[#74b8e4]" : RF_PTP >= 7 && RF_PTP < 17 ? "text-3xl font-bold text-center text-[#45bc8d]" : RF_PTP >= 17 ? "text-3xl font-bold text-center text-[#fbef20]" : "" }>{getRiskLevel(RF_PTP)}</p>
                            </div>
                            <div>
                                <div className="flex flex-row gap-5 items-center justify-center">
                                    <div>
                                    <img 
                                        src="/img/hearth.png"
                                        alt="hearth"
                                        width={400}
                                        height={400}
                                        className="h-14 lg:h-24 w-auto block"
                                    />
                                    </div>
                                    <div className="flex-initial">                                                                           
                                        <div className="text-center">
                                            <span className={RF_PTP < 7 ? "inline-flex aspect-square items-center justify-center text-[1.2rem] lg:text-3xl bg-[#74b8e4] text-white size-14 lg:size-24 rounded-full" : RF_PTP >= 7 && RF_PTP < 17 ? "inline-flex aspect-square items-center justify-center text-[1.2rem] lg:text-3xl bg-[#45bc8d] text-white size-14 lg:size-24 rounded-full" : RF_PTP >= 17 ? "inline-flex aspect-square items-center justify-center text-[1.2rem] lg:text-3xl bg-[#fbef20] text-white size-14 lg:size-24 rounded-full" : "" }>
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
                            <span className='mb-7 border border-secondary shadow-md font-semibold text-[0.7rem] lg:text-lg flex items-center justify-center py-1.5 px-5 rounded-3xl bg-primary text-white'>
                            Abnormal clinical findings
                            </span>
                        </div>
                        {
                            finalAdjust && (
                                <>
                                
                                <section className='grid grid-cols-12'>
                                
                                    <div className="mb-3 col-span-8">
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
                                            <input type='checkbox' defaultChecked={finalAdjust[0] == 0 && finalAdjust[1] == 0 && finalAdjust[2] == 0 && finalAdjust[3] == 0 && finalAdjust[4] == 0 && finalAdjust[5] == 0} readOnly />
                                            <label>
                                                None
                                            </label>
                                        </div>

                                    </div>

                                    <div className="col-span-4">
                                        {/* <div className="aspect-square h-auto w-full mb-3 p-3 bg-gray-200 flex justify-center items-center rounded-3xl">
                                            <p className="text-[0.7rem] lg:text-lg font-bold text-center">
                                                {
                                                    finalAdjust[0] == 0 && finalAdjust[1] == 0 && finalAdjust[2] == 0 && finalAdjust[3] == 0 && finalAdjust[4] == 0 && finalAdjust[5] == 0 ? 'Decrease' : 'Increase'
                                                }
                                                <br />
                                                Clinical Likelihood
                                            </p>
                                        </div> */}
                                        <div className="aspect-square lg:aspect-[3/2] h-auto w-full mb-3 p-3 bg-gray-200 flex flex-col justify-center items-center rounded-3xl relative">
                                            <div className="text-center ">
                                                {/* <svg className="size-5 fill-primary" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M205.66,117.66a8,8,0,0,1-11.32,0L136,59.31V216a8,8,0,0,1-16,0V59.31L61.66,117.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,205.66,117.66Z"></path></svg> */}
                                                <svg className="size-5 fill-primary" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#25215f" stroke-width="1.5"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM16.0303 10.9697L12.5303 7.46967C12.2374 7.17678 11.7626 7.17678 11.4697 7.46967L7.96967 10.9697C7.67678 11.2626 7.67678 11.7374 7.96967 12.0303C8.26256 12.3232 8.73744 12.3232 9.03033 12.0303L11.25 9.81066V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V9.81066L14.9697 12.0303C15.2626 12.3232 15.7374 12.3232 16.0303 12.0303C16.3232 11.7374 16.3232 11.2626 16.0303 10.9697Z" fill="#25215f"></path></svg>
                                            </div>
                                            <p className="text-[0.7rem] lg:text-lg font-normal text-center">
                                                <span className="text-primary text-[0.8rem] lg:text-xl font-bold">
                                                    {
                                                        finalAdjust[0] == 0 && finalAdjust[1] == 0 && finalAdjust[2] == 0 && finalAdjust[3] == 0 && finalAdjust[4] == 0 && finalAdjust[5] == 0 ? 'Decrease' : 'Increase'
                                                    }
                                                </span>
                                                <br />
                                                Clinical Likelihood
                                            </p>
                                        </div>
                                    </div>

                                </section>

                                </>
                            )
                        }

                        <div className="mt-3">
                            <span className='mb-7 border border-secondary shadow-md font-semibold text-[0.7rem] lg:text-lg flex items-center justify-center py-1.5 px-5 rounded-3xl bg-primary text-white'>
                                CACS-weighted clinical likelihood
                            </span>
                        </div>
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
                        <div className="relative z-0 mx-auto w-fit">
                            <label className="input input-bordered shadow-md flex items-center gap-2">
                                <span className="text-primary font-bold">
                                CACS = 
                                </span> 
                                <input 
                                    type="number" 
                                    className="grow text-center text-xl font-bold text-primary"
                                    value={cacsScore} 
                                    readOnly
                                />
                            </label>
                        </div>
                        <div className="mt-4 space-y-5">
                            <div className="p-5 py-10 bg-primary text-white rounded-xl relative">
                                {/* <div className="absolute -top-[10px] right-[5px] px-3 py-1 bg-yellow-300 rounded-lg shadow-md shadow-black/70 text-primary text-sm">
                                    <span className="font-semibold">Increase</span>
                                </div> */}
                                <div className="grid grid-cols-5 gap-1 lg:gap-5 items-center">
                                
                                    <section className="flex flex-col gap-5 items-center justify-center col-span-2">
                                        <div className="min-w-[170px]">
                                            <p className="text-[1rem] lg:text-xl font-medium text-center">
                                            RF-PTP
                                            </p>
                                            <p className={RF_PTP < 7 ? "text-[1.2rem] lg:text-3xl font-bold text-center text-[#74b8e4]" : RF_PTP >= 7 && RF_PTP < 17 ? "text-[1rem] lg:text-3xl font-bold text-center text-[#45bc8d]" : RF_PTP >= 17 ? "text-[1rem] lg:text-3xl font-bold text-center text-[#fbef20]" : "" }>{getRiskLevel(RF_PTP)}</p>
                                        </div>
                                        <div>
                                            <div className="flex flex-row gap-1 lg:gap-5 items-center justify-center">
                                                <div>
                                                <img 
                                                    src="/img/hearth.png"
                                                    alt="hearth"
                                                    width={400}
                                                    height={400}
                                                    className="h-14 lg:h-24 w-auto block"
                                                />
                                                </div>
                                                <div className="flex-initial">                                                                           
                                                    <div className="text-center">
                                                        <span className={RF_PTP < 7 ? "inline-flex aspect-square items-center justify-center text-[1.2rem] lg:text-3xl bg-[#74b8e4] text-white size-14 lg:size-24 rounded-full" : RF_PTP >= 7 && RF_PTP < 17 ? "inline-flex aspect-square items-center justify-center text-[1.2rem] lg:text-3xl bg-[#45bc8d] text-white size-14 lg:size-24 rounded-full" : RF_PTP >= 17 ? "inline-flex aspect-square items-center justify-center text-[1.2rem] lg:text-3xl bg-[#fbef20] text-white size-14 lg:size-24 rounded-full" : "" }>
                                                            {RF_PTP} <span className='text-base'>%</span>
                                                        </span>
                            
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                    <div className="flex items-center justify-center">
                                        <svg className="size-14" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fff" viewBox="0 0 256 256"><path d="M237.66,122.34l-96-96A8,8,0,0,0,128,32V72H48A16,16,0,0,0,32,88v80a16,16,0,0,0,16,16h80v40a8,8,0,0,0,13.66,5.66l96-96A8,8,0,0,0,237.66,122.34ZM144,204.69V176a8,8,0,0,0-8-8H48V88h88a8,8,0,0,0,8-8V51.31L220.69,128Z"></path></svg>
                                    </div>
                                    <section className="flex flex-col gap-5 items-center justify-center col-span-2">
                                        <div className="min-w-[170px]">
                                            <p className="text-[1rem] lg:text-xl font-medium text-center">
                                            CACS-CL
                                            </p>
                                            <p className={CACS < 7 ? "text-[1.2rem] lg:text-3xl font-bold text-center text-[#74b8e4]" : CACS >= 7 && CACS < 17 ? "text-3xl font-bold text-center text-[#45bc8d]" : CACS >= 17 ? "text-3xl font-bold text-center text-[#fbef20]" : "" }>{getRiskLevel(CACS)}</p>
                                        </div>
                                        <div>
                                            <div className="flex flex-row gap-1 lg:gap-5 items-center justify-center">
                                                <div>
                                                <img 
                                                    src="/img/hearth.png"
                                                    alt="hearth"
                                                    width={400}
                                                    height={400}
                                                    className="h-14 lg:h-24 w-auto block"
                                                />
                                                </div>
                                                <div className="flex-initial">                                                                           
                                                    <div className="text-center">
                                                        <span className={CACS < 7 ? "inline-flex aspect-square items-center justify-center text-[1.2rem] lg:text-3xl bg-[#74b8e4] text-white size-14 lg:size-24 rounded-full" : CACS >= 7 && CACS < 17 ? "inline-flex aspect-square items-center justify-center text-[1.2rem] lg:text-3xl bg-[#45bc8d] text-white size-14 lg:size-24 rounded-full" : CACS >= 17 ? "inline-flex aspect-square items-center justify-center text-[1.2rem] lg:text-3xl bg-[#fbef20] text-white size-14 lg:size-24 rounded-full" : "" }>
                                                            {CACS} <span className='text-base'>%</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                </div>
                            </div>

                        </div>


                    </div>


                    <div id='hiddenForImage' className='text-center mt-10 grid grid-cols-2 gap-3 px-3'>
                        <button className="btn btn-primary w-full" onClick={save}>
                            {
                                lang == 'th' ? 'บันทึกรูปภาพ' : 'SAVE IMG'
                            }
                        </button>
                        <button className="btn btn-primary w-full" onClick={() => router.push('/print')}>
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

