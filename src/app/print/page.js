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
        if (value >= 0 && value < 7) {
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
        if (value > 15) {
            if (lang == 'th') {
                return "ปานกลาง";
            }
            return "Moderate";
        }; // สีเหลือง
        return "Unknown"; // กรณีไม่มีในช่วง
    };

    console.log('cacsScore', cacsScore)


    const generatePdf2 = () => {

        const element = document.getElementById('record1');
        const element2 = document.getElementById('record2');


        // const element = pdfRef.current; // อ้างอิง DOM ที่ต้องการแปลงเป็น PDF
        const originalWidth = 210; // กว้างของ A4
        // const originalHeight = 297; // สูงของ A4
        const originalHeight = 270; // สูงของ A4


        // const pdf = new jsPDF("p", "mm", "a4"); // สร้างไฟล์ PDF
        const pdf = new jsPDF({
            orientation: "p", // แนวตั้ง (portrait)
            unit: "mm",
            format: [originalWidth, originalHeight], // ใช้ขนาดที่กำหนดเอง
        });

        let pdfWidth = pdf.internal.pageSize.getWidth(); // กว้างของ PDF
        // let pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth; // คำนวณความสูงให้พอดี
        let pdfHeight = pdfWidth * (297 / 210);

        const elements = [element, element2];

        const screenWidth = window.innerWidth;
        const scale = screenWidth < 700 ? 4 : 1;

        const promises = elements.map(el => domtoimage.toPng(el, {
            quality: 1,
            scale: scale,
            width: el.offsetWidth * scale,
            height: el.offsetHeight * scale,
            style: {
                transform: `scale(${scale})`,
                transformOrigin: 'top left'
            }
        }));
        Promise.all(promises)
          .then((imgDatas) => {
            
            imgDatas.forEach((imgData, index) => {
                
              if (index > 0) {
                pdf.addPage();
              }
              pdf.addImage(imgData, "PNG", 0, 0, originalWidth, originalHeight);
            });
            pdf.save(`recorded-1-${time}.pdf`); // บันทึกไฟล์ PDF
          })
        .finally(() => {
            router.push('/record');
        })
        .catch((error) => {
            console.error(error);
        });        

        const time = new Date().getTime();

        // pdf.addImage(imgData1, "PNG", 0, 0, pdfWidth, pdfHeight); // เพิ่มรูปภาพลงใน PDF


    };

    useEffect(() => {
        setTimeout(() => { 
            generatePdf2();
        }, 1000);
        // document.addEventListener('DOMContentLoaded', () => {
        //     if (document.readyState === 'complete') {
        //         generatePdf2();
        //     } else {
        //         window.addEventListener('load', generatePdf2);
        //     }
        // });

        
    }, []);



    return (
        <>  
        <div className="max-w-screen-md mx-auto min-h-screen overflow-hidden app-wrapper-print   relative ">
            <section id='record1' className="my-0 p-2 py-0 bg-white shadow mx-auto relative max-w-screen-md aspect-[210/297] overflow-hidden">
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
                        <h2 className='text-[0.75rem] lg:text-lg font-bold text-primary mb-4 text-center'>Risk Factor-weighted Clinical Likelihood</h2>
                        
                        <section className="flex gap-3 lg:gap-10 text-[0.65rem] lg:text-base">
                            <div>
                                <p className=''>
                                    <span className='font-semibold'>
                                        {
                                            lang == 'th' ? 'เพศ' : 'Sex'
                                        }
                                    </span> : {sex} 
                                    <span className='inline-block px-1 lg:px-4'>|</span>
                                    <span className='font-semibold'>
                                        {
                                            lang == 'th' ? 'อายุ' : 'Age'
                                        }
                                    </span> : {ageRange[age-1]}
                                </p>
                            </div>
                            <div className="block">
                                <div className="flex items-center gap-2 lg:gap-5">
                                    <p>
                                        <span className='font-semibold'>Name : </span>..................................<span className="hidden lg:inline">.............</span>
                                    </p>
                                    <p>
                                        <span className='font-semibold'>HN : </span>...........<span className="hidden lg:inline">......</span>
                                    </p>
                                </div>
                            </div>
                        </section>
                        <hr className='mt-3' />
                        <section className="grid grid-cols-2 gap-4">

                            <div className='space-y-1 mt-4 text-sm'>
                                <div>
                                    <span className='mb-2 border border-secondary shadow-md font-semibold text-[0.6rem] lg:text-base w-full lg:w-[250px] inline-flex items-center justify-center py-0.5 px-3 lg:px-5 rounded-3xl bg-primary text-white'>
                                        {
                                            symptom == 'option1' && finalSection1 ? (
                                                <>
                                                {
                                                    lang == 'th' ? 'เจ็บหน้าอก' : 'Chest pain characteristics'
                                                }
                                                </>
                                            ) : (
                                                <>
                                                {
                                                    lang == 'th' ? 'หายใจลำบาก' : 'Dyspnoea characteristics'
                                                }
                                                </>
                                            )
                                        }
                                    </span>
                                </div>
                                {
                                    symptom == 'option1' && finalSection1 && (
                                        <div className='lg:space-y-1 mt- lg:mt-4 text-[0.7rem] lg:text-base'>
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
                                        <div className='lg:space-y-1 mt- lg:mt-4 text-[0.65rem] lg:text-base'>
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
                            <div className='lg:space-y-1 mt-4 lg:mt-4 text-[0.65rem] lg:text-base'>
                                <div>
                                    <span className='mb-3 lg:mb-2 border border-secondary shadow-md font-semibold text-[0.6rem] lg:text-base w-full lg:w-[250px] inline-flex items-center justify-center py-1 lg:py-0.5 px-3 lg:px-5 rounded-3xl bg-primary text-white'>
                                    {lang == 'th' ? 'ข้อมูลส่วนตัว' : 'Risk Factor for CAD'}
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
                                            lang == 'th' ? 'ไม่มี' : 'None'
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
                            src={lang == 'th' ? '/img/score-board-th.png' : '/img/score-board.png'}
                            alt="score-board"
                            width={900}
                            height={400}
                            className="block aspect-[1097/388] w-2/3 lg:w-full mx-auto"
                        />
                    </div>

                    <div className="p-2 lg:p-5 py-4 lg:py-10 bg-primary text-white rounded-xl relative bottom-4 lg:bottom-0 scale-75 lg:scale-100">
                        <div className="flex flex-row gap-5 items-center justify-center">
                            <div>
                                <p className="text-[1rem] lg:text-xl font-medium text-center">
                                {
                                    lang == 'th' ? 'ความเสี่ยงของคุณอยู่ในระดับ' : 'Clinical likelihood'
                                }   
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

        
                </div>
            </section>

            <div id="divider" className="my-20 hidden">

            </div>

            <section id='record2' className="my-0 p-2 py-0 bg-white mx-auto shadow relative max-w-screen-md aspect-[210/297] overflow-hidden">
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


                <div className='space-y-1 lg:space-y-4'>
                    <div className='record-box'>
                        <h2 className='text-[0.75rem] lg:text-lg font-bold text-primary lg:mb-4 text-center relative z-10'>
                            Adjust clinical likelihood based on abnormal clinical findings
                            & Coronary artery calcium score (CACS)
                        </h2>
                        

                    </div>          

                    <div className='record-box relative z-10'>
                    <div className="lg:mt-3">
                            <span className='mb-2 lg:mb-7 border border-secondary shadow-md font-semibold text-[0.7rem] lg:text-lg flex items-center justify-center py-1.5 px-5 rounded-3xl bg-primary text-white'>
                            {
                                lang == 'th' ? 'ผลการตรวจทางคลินิกที่ผิดปกติ' : 'Abnormal clinical findings'
                            }
                            </span>
                        </div>
                        {
                            finalAdjust && (
                                <>
                                
                                <section className={lang == 'th' ? 'grid grid-cols-12 -mb-4' : 'grid grid-cols-12'}>
                                
                                    <div className={lang == 'th' ? 'mb-3 col-span-9 lg:col-span-8 text-[0.7rem] lg:text-base -mt-4 scale-90' : 'mb-3 col-span-9 lg:col-span-8 text-[0.7rem] lg:text-base'}>
                                        {/* <img src="/img/test-mockup-01.jpg" alt="graph2" width={939} height={355} className="block my-8" /> */}
                                        <div className='recordCheckbox'>
                                            <input type='checkbox' defaultChecked={finalAdjust[0] != 0} readOnly />
                                            <label>                                                
                                                {
                                                    lang == 'th' ? 'ความผิดปกติของคลื่นไฟฟ้าหัวใจขณะพัก (การเปลี่ยนแปลงของคลื่น Q หรือการเปลี่ยนแปลงของส่วน ST/คลื่น T)' : 'Resting ECG changes (Q-wave or ST-segment/T-wave changes)'
                                                }
                                            </label>
                                        </div>
                                        <div className='recordCheckbox'>
                                            <input type='checkbox' defaultChecked={finalAdjust[1] != 0} readOnly />
                                            <label>
                                                {
                                                    lang == 'th' ? 'ผลการตรวจคลื่นไฟฟ้าหัวใจขณะออกกำลังกายที่ผิดปกติ' : 'Exercise ECG with abnormal findings'
                                                }
                                            </label>
                                        </div>
                                        <div className='recordCheckbox'>
                                            <input type='checkbox' defaultChecked={finalAdjust[2] != 0} readOnly />
                                            <label>
                                                {
                                                    lang == 'th' ? 'ภาวะการทำงานบกพร่องของหัวใจห้องล่างซ้าย (ชนิดรุนแรงหรือเฉพาะส่วน)' : 'LV dysfunction (severe or segmental)'
                                                }
                                            </label>
                                        </div>
                                        <div className='recordCheckbox'>
                                            <input type='checkbox' defaultChecked={finalAdjust[3] != 0} readOnly />
                                            <label>
                                                {
                                                    lang == 'th' ? 'ภาวะหัวใจห้องล่างเต้นผิดจังหวะ' : 'Ventricular arrhythmia'
                                                }
                                            </label>
                                        </div>
                                        <div className='recordCheckbox'>
                                            <input type='checkbox' defaultChecked={finalAdjust[4] != 0} readOnly />
                                            <label>
                                                {
                                                    lang == 'th' ? 'โรคหลอดเลือดแดงส่วนปลาย' : 'Peripheral artery disease'
                                                }
                                            </label>
                                        </div>
                                        <div className='recordCheckbox'>
                                            <input type='checkbox' defaultChecked={finalAdjust[5] != 0} readOnly />
                                            <label>
                                                {
                                                    lang == 'th' ? 'การสะสมของแคลเซียมในหลอดเลือดหัวใจที่พบจากภาพถ่ายทรวงอกที่มีอยู่เดิม' : 'Coronary calcification on pre-existing chest CT'
                                                }
                                            </label>
                                        </div>
                                        <div className='recordCheckbox'>
                                            <input type='checkbox' defaultChecked={finalAdjust[0] == 0 && finalAdjust[1] == 0 && finalAdjust[2] == 0 && finalAdjust[3] == 0 && finalAdjust[4] == 0 && finalAdjust[5] == 0} readOnly />
                                            <label>
                                                {
                                                    lang == 'th' ? 'ไม่พบความผิดปกติ' : 'None'
                                                }
                                            </label>
                                        </div>

                                    </div>

                                    <div className="col-span-3 lg:col-span-4">
                                        <div className="aspect-square lg:aspect-[3/2] h-auto w-full mb-3 p-3 bg-gray-200 flex flex-col justify-center items-center rounded-3xl relative">
                                            <div className="text-center ">
                                                {/* <svg className="size-5 fill-primary" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M205.66,117.66a8,8,0,0,1-11.32,0L136,59.31V216a8,8,0,0,1-16,0V59.31L61.66,117.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,205.66,117.66Z"></path></svg> */}
                                                <svg className={`size-5 fill-primary ${finalAdjust[0] == 0 && finalAdjust[1] == 0 && finalAdjust[2] == 0 && finalAdjust[3] == 0 && finalAdjust[4] == 0 && finalAdjust[5] == 0 ? 'rotate-180' : ''}`} width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#25215f" strokeWidth="1.5"><path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM16.0303 10.9697L12.5303 7.46967C12.2374 7.17678 11.7626 7.17678 11.4697 7.46967L7.96967 10.9697C7.67678 11.2626 7.67678 11.7374 7.96967 12.0303C8.26256 12.3232 8.73744 12.3232 9.03033 12.0303L11.25 9.81066V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V9.81066L14.9697 12.0303C15.2626 12.3232 15.7374 12.3232 16.0303 12.0303C16.3232 11.7374 16.3232 11.2626 16.0303 10.9697Z" fill="#25215f"></path></svg>
                                            </div>
                                            <p className={lang == 'th' ? 'text-[0.5rem] lg:text-lg font-normal text-center' : 'text-[0.7rem] lg:text-lg font-normal text-center'}>
                                                <span className="text-primary text-[0.8rem] lg:text-xl font-bold">
                                                    {
                                                        lang == 'th' ?
                                                        finalAdjust[0] == 0 && finalAdjust[1] == 0 && finalAdjust[2] == 0 && finalAdjust[3] == 0 && finalAdjust[4] == 0 && finalAdjust[5] == 0 ? 'ลดลง' : 'เพิ่มขึ้น'
                                                        :
                                                        finalAdjust[0] == 0 && finalAdjust[1] == 0 && finalAdjust[2] == 0 && finalAdjust[3] == 0 && finalAdjust[4] == 0 && finalAdjust[5] == 0 ? 'Decrease' : 'Increase'
                                                    }
                                                </span>
                                                <br />
                                                {
                                                    lang == 'th' ? 'ผลการตรวจทางคลินิก' : 'Clinical Likelihood'
                                                }
                                            </p>
                                        </div>
                                    </div>

                                </section>

                                </>
                            )
                        }
                        <div className="-mt-2 lg:mt-3">
                            <span className='mb-1 lg:mb-7 border border-secondary shadow-md font-semibold text-[0.7rem] lg:text-lg flex items-center justify-center py-1.5 px-5 rounded-3xl bg-primary text-white relative z-10'>
                                {
                                    lang == 'th' ? 'ความน่าจะเป็นทางคลินิกที่ถ่วงน้ำหนักด้วย CACS' : 'CACS-weighted clinical likelihood'
                                }
                            </span>
                        </div>
                        <div className='relative mb-0 lg:my-3 mx-auto w-[70%] z-0'>
                            <img
                                className="block "
                                src={lang == 'th' ? '/img/graph2-th.png' : '/img/graph2.png'}
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
                        <div className="relative z-0 mx-auto w-full scale-[0.7] lg:scale-100">
                            <div className="flex items-center justify-center gap-2 border border-neutral-200 px-2 py-1 rounded-lg">
                                <span className="text-primary font-bold leading-none">
                                    CACS = 
                                </span> 
                                <span className="text-lg font-bold text-primary leading-none">
                                    {cacsScore}
                                </span>
                            </div>
                        </div>
                        <div className="lg:mt-4 space-y-5 scale-[0.7] lg:scale-100 relative bottom-6 lg:bottom-0">
                            <div className="p-5 py-2 bg-primary text-white rounded-xl relative">
                                {/* <div className="absolute -top-[10px] right-[5px] px-3 py-1 bg-yellow-300 rounded-lg shadow-md shadow-black/70 text-primary text-sm">
                                    <span className="font-semibold">Increase</span>
                                </div> */}
                                <div className="grid grid-cols-5 gap-1 lg:gap-5 items-center">
                                
                                    <section className="flex flex-col gap-5 items-center justify-center col-span-2">
                                        <div className="min-w-[170px]">
                                            <p className="text-[1rem] lg:text-xl font-medium text-center">
                                            RF-CL
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
                                            <p className={CACS < 7 ? "result-circle-text text-[#74b8e4]" : CACS >= 7 && CACS < 17 ? "result-circle-text text-[#45bc8d]" : CACS >= 17 ? "result-circle-text text-[#fbef20]" : "" }>{getRiskLevel(CACS)}</p>
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
                                                            {
                                                                // CACS >= 100 ? 100 : Number(CACS).toFixed(0)
                                                                Number(CACS).toFixed(0)
                                                            } 
                                                            <span className='text-base'>%</span>
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

                </div>
            </section>
        </div>
        </>
    );
}

