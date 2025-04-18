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

import { useReactToPrint } from "react-to-print";

export default function Print() {

    const pdfRef = useRef();

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
    const [Adjust , setAdjust] = useState(0);
    
    // report
    const [sex , setSex] = useState('');
    const [age , setAge] = useState('');
    const [symptom , setSymptom] = useState(null);
    const [Section1 , setSection1] = useState('');
    const [Section2 , setSection2] = useState('');
    const [CACS , setCACS] = useState('');

    const [finalSection1 , setFinalSection1] = useState(null);
    const [finalSection2 , setFinalSection2] = useState(null);

    // data var
    const ageRange = ["30-39", "40-49", "50-59", "60-69", "70-80"];

    useEffect(() => {
        const RF_PTP_value = cookies.get('RF_PTP')
        const sex = cookies.get('sex')
        const age = cookies.get('age')
        const symptom = cookies.get('symptom')
        const Section1 = cookies.get('Section1')
        const Section2 = cookies.get('Section2')
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

    }

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


    const captureDivAsImage = (time) => {
        const element = document.getElementById('record');       
        const recordFooter = document.getElementById('recordFooter');        
        const renderForImage = document.getElementById('renderForImage');
        renderForImage.classList.remove('hidden');
        recordFooter.classList.remove('hidden');

        element.classList.add('record-textresize');
 
        if (element) {
            domtoimage.toPng(element)
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `recorded-1-${time}.png`;
                link.click();
            })
            .finally(() => {
                element.classList.remove('record-textresize');
                recordFooter.classList.add('hidden');
                renderForImage.classList.add('hidden');
            })
            .catch((error) => {
                element.classList.remove('record-textresize');
                recordFooter.classList.add('hidden');
                renderForImage.classList.add('hidden');
                console.error('Error capturing image:', error);
            });
        }
    };

    const save = () => {
        const time = new Date().getTime();
        captureDivAsImage(time);
    }

    const captureDivAsPdf = (time) => {
        
        const element = document.getElementById('record');
        const options = {
            filename: `recorded-1-${time}.pdf`,
        };
        if (element) {
            domToPdf(element, options, function(pdf) {
                console.log('done');
            });
        }
    };

    const saveAsPdf = () => {
        const time = new Date().getTime();
        captureDivAsPdf(time);
    }

    const generatePdf = () => {

        const element = document.getElementById('record');

        const recordFooter = document.getElementById('recordFooter');
        recordFooter.classList.remove('hidden');

        element.classList.add('record-textresize');


        // const element = pdfRef.current; // อ้างอิง DOM ที่ต้องการแปลงเป็น PDF
        const originalWidth = 210; // กว้างของ A4
        const originalHeight = 297; // สูงของ A4


        // const pdf = new jsPDF("p", "mm", "a4"); // สร้างไฟล์ PDF
        const pdf = new jsPDF({
            orientation: "p", // แนวตั้ง (portrait)
            unit: "mm",
            format: [originalWidth, originalHeight], // ใช้ขนาดที่กำหนดเอง
        });
    
        domtoimage.toPng(element) // แปลง DOM เป็นรูปภาพ PNG
          .then((imgData) => {
            const pdfWidth = pdf.internal.pageSize.getWidth(); // กว้างของ PDF
            const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth; // คำนวณความสูงให้พอดี

            const time = new Date().getTime();
    
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); // เพิ่มรูปภาพลงใน PDF
            pdf.save(`recorded-1-${time}.pdf`); // บันทึกไฟล์ PDF
          })
          .finally(() => {
            
            element.classList.remove('record-textresize');
            recordFooter.classList.add('hidden');
          })
          .catch((error) => {
            console.error("เกิดข้อผิดพลาดขณะสร้าง PDF:", error);
          });

    };


    const generatePdf2 = () => {

        const element = document.getElementById('record');
        const element2 = document.getElementById('record2');
        const recordFooter = document.getElementById('recordFooter');

        const record2Header = document.getElementById('record2Header');
        const record2Footer = document.getElementById('record2Footer');


        element.classList.add('record-a4size');
        element2.classList.add('record-a4size');

        recordFooter.classList.remove('hidden');
        record2Header.classList.remove('hidden');
        record2Footer.classList.remove('hidden');

        element.classList.add('record-textresize');
        element2.classList.add('record-textresize');


        // const element = pdfRef.current; // อ้างอิง DOM ที่ต้องการแปลงเป็น PDF
        const originalWidth = 210; // กว้างของ A4
        const originalHeight = 297; // สูงของ A4


        // const pdf = new jsPDF("p", "mm", "a4"); // สร้างไฟล์ PDF
        const pdf = new jsPDF({
            orientation: "p", // แนวตั้ง (portrait)
            unit: "mm",
            format: [originalWidth, originalHeight], // ใช้ขนาดที่กำหนดเอง
        });

        let pdfWidth = pdf.internal.pageSize.getWidth(); // กว้างของ PDF
        let pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth; // คำนวณความสูงให้พอดี

        const elements = [element, element2];
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
            element.classList.remove('record-textresize');
            element2.classList.remove('record-textresize');
            element.classList.remove('record-a4size');
            element2.classList.remove('record-a4size');
            recordFooter.classList.add('hidden');
            record2Header.classList.add('hidden');
            record2Footer.classList.add('hidden');
        })
        .catch((error) => {
            console.error("เกิดข้อผิดพลาดขณะสร้าง PDF:", error);
            element.classList.remove('record-textresize');
            element2.classList.remove('record-textresize');
            element.classList.remove('record-a4size');
            element2.classList.remove('record-a4size');
            recordFooter.classList.add('hidden');
            record2Header.classList.add('hidden');
            record2Footer.classList.add('hidden');
        });        

        const time = new Date().getTime();

        // pdf.addImage(imgData1, "PNG", 0, 0, pdfWidth, pdfHeight); // เพิ่มรูปภาพลงใน PDF


    };

    console.log('symptom', symptom);

    console.log('Section1',Section1)
    console.log('Section2',Section2)
    const Section1List = Section1.split(',');
    const Section2List = Section2.split(',');
    console.log('Section1List',Section1List)
    console.log('Section2List',Section2List)


    console.log('lang',lang)

    // useEffect(() => {
    //     setFinalSection1(Section1List);
    //     setFinalSection2(Section2List);
    // }, [Section1]);

    useEffect(() => {
        if (Section1) {
            setFinalSection1(Section1.split(','));
        }
        if (Section2) {
            setFinalSection2(Section2.split(','));
        }
    }, [Section1, Section2]);

    if(!finalSection1)
    {
        return
    }

    return (
        <>  
        <div className="max-w-[500px] mx-auto bg-white shadow min-h-screen overflow-hidden app-wrapper relative">
            <main ref={pdfRef} id='record' className="my-0 p-2 py-0 bg-white mx-auto max-w-screen-md relative">
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
                        {/* Section2 */}
                        <hr className='my-3' />
                        {
                            finalSection2 && (
                                <div className='space-y-1 mt-4 '>
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
                                </div>
                            )
                        }
                        

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

                    <div className="hidden" id="renderForImage">

                        <div className="p-5 bg-primary text-white rounded-xl">
                            <p className="text-xl font-medium text-center">
                                {
                                    lang == 'th' ? 'ความเสี่ยงของคุณอยู่ในระดับ' : 'Clinical likelihood'
                                }
                            </p>
                            <p className={RF_PTP < 7 ? "text-3xl font-bold text-center text-[#74b8e4]" : RF_PTP >= 7 && RF_PTP < 17 ? "text-3xl font-bold text-center text-[#45bc8d]" : RF_PTP >= 17 ? "text-3xl font-bold text-center text-[#c7c246]" : "" }>{getRiskLevel(RF_PTP)}</p>
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
                                        {/* <span className='inline-flex aspect-square items-center justify-center text-3xl bg-[#74b8e4] text-white w-24 h-24 rounded-full'> */}
                                            {RF_PTP} <span className='text-base'>%</span>
                                        </span>
            
                                    </div>
                                </div>
                            </div>
                        </div>

                        

                        <div className='record-box'>
                            <h2 className='text-lg font-bold text-primary mb-4'>
                                {
                                    lang == 'th' ? 'Consider reclassification of low RF-CL' : 'Consider reclassification of low RF-CL'
                                }
                            </h2>
                            <img
                                src="/img/graph2.png"
                                width={939}
                                height={355}
                                alt="Picture of the author"
                            />

                            <div className='mt-4'>
                                <p>
                                    <span className='font-semibold inline-block w-[80px]'>CACS CL</span>  <span className="">:</span> <span className="ml-4">{CACS} %</span>
                                </p>
                                <p>
                                    <span className='font-semibold inline-block w-[80px]'>RF_PTP</span> <span className="">:</span> <span className="ml-4">{RF_PTP} %</span>
                                </p>
                            </div>

                        </div>

                    </div>

                </div>
                <div id="recordFooter" className="record-footer hidden"></div>
            </main>
            <main id='record2' className="my-0 p-2 py-0 bg-white mx-auto max-w-screen-md relative">
                <div id="record2Header" className="relative z-0 hidden">
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

                    <div className="p-5 bg-primary text-white rounded-xl">
                        <p className="text-xl font-medium text-center">
                            {
                                lang == 'th' ? 'ความเสี่ยงของคุณอยู่ในระดับ' : 'Clinical likelihood'
                            }
                        </p>
                        <p className={RF_PTP < 7 ? "text-3xl font-bold text-center text-[#74b8e4]" : RF_PTP >= 7 && RF_PTP < 17 ? "text-3xl font-bold text-center text-[#45bc8d]" : RF_PTP >= 17 ? "text-3xl font-bold text-center text-[#c7c246]" : "" }>{getRiskLevel(RF_PTP)}</p>
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
                                    {/* <span className='inline-flex aspect-square items-center justify-center text-3xl bg-[#74b8e4] text-white w-24 h-24 rounded-full'> */}
                                        {RF_PTP} <span className='text-base'>%</span>
                                    </span>
        
                                </div>
                            </div>
                        </div>
                    </div>

                    

                    <div className='record-box'>
                        <h2 className='text-lg font-bold text-primary mb-4'>
                            {
                                lang == 'th' ? 'Consider reclassification of low RF-CL' : 'Consider reclassification of low RF-CL'
                            }
                        </h2>
                        <img
                            src="/img/graph2.png"
                            width={939}
                            height={355}
                            alt="Picture of the author"
                        />

                        <div className='mt-4'>
                            <p>
                                <span className='font-semibold inline-block w-[80px]'>CACS CL</span>  <span className="">:</span> <span className="ml-4">{CACS} %</span>
                            </p>
                            <p>
                                <span className='font-semibold inline-block w-[80px]'>RF_PTP</span> <span className="">:</span> <span className="ml-4">{RF_PTP} %</span>
                            </p>
                        </div>

                    </div>




                </div>
                <div id="record2Footer" className="record-footer hidden"></div>
            </main>
            <div className='text-center mt-10 grid grid-cols-2 gap-3 px-3'>
                    <button className="btn btn-primary w-full" onClick={save}>
                        {
                            lang == 'th' ? 'บันทึกรูปภาพ' : 'SAVE IMG'
                        }
                    </button>
                    <button className="btn btn-primary w-full" onClick={generatePdf2}>
                        {
                            lang == 'th' ? 'บันทึกเป็น PDF' : 'SAVE PDF'
                        }
                    </button>
            </div>
        </div>
        </>
    );
}

