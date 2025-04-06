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
        

        if (!RF_PTP_value || !sex || !age) {
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


    const generatePdf2 = () => {

        const element = document.getElementById('record1');


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

        const elements = [element];

        const screenWidth = window.innerWidth;
        const scale = screenWidth < 700 ? 4 : 1;

        const promises = elements.map(el => domtoimage.toPng(el));
        Promise.all(promises)
          .then((imgDatas) => {
            imgDatas.forEach((imgData, index) => {
              if (index > 0) {
                pdf.addPage();
              }
              pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            });
            pdf.save(`recorded-1-${time}.pdf`); // บันทึกไฟล์ PDF
          })
        .finally(() => {
            router.push('/record-section1');
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
            <section id='record1' className="my-0 p-2 py-0 bg-white shadow mx-auto relative max-w-screen-md min-h-screen lg:min-h-auto lg:aspect-[210/297] overflow-hidden">
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
        </div>
        </>
    );
}

