'use client';
import Image from "next/image";
import Header from "@/components/Header";
import Title from "@/components/Title";
import AgeSex from "@/components/AgeSex";
import Question from "@/components/Question";
import Skeleton from "@/components/Skeleton";
import Result from "@/components/Result";
import SymptomSection from "@/components/SymptomSection";

import { useEffect, useState } from "react";

import pageTitle from '@/data/pageTitle.json'
import questionTitle from '@/data/questionTitle.json'
import questionTitleSection1_1 from '@/data/questionTitleSection1_1.json'
import questionTitleSection1_2 from '@/data/questionTitleSection1_2.json'
import questionTitleSection2 from '@/data/questionTitleSection2.json'

export default function Home() {
    const [stateSection , setStateSection] = useState({
        start : true,
        symptom : false,
        questionSection_1_1 : false,
        questionSection_1_2 : false,        
        questionSection_2 : false,        
        showResult : false
    });
    const [loading , setLoading] = useState(false);
    const [symptomSectionSelected , setSymptomSectionSelected] = useState(null);
    const [sex , setSex] = useState(null);
    const [age , setage] = useState(null);
    const [step , setStep] = useState(0);
    const [maxStep , setMaxStep] = useState(0);
    const [score , setScore] = useState([
        {
            score: null
        },
        {
            score: null
        },
        {
            score: null
        },
        {
            score: null
        },
        {
            score: null
        },
        {
            score: null
        },
        {
            score: null
        },
        {
            score: null
        },
        {
            score: null
        }
    ]);
    const [totalScore , setTotalScore] = useState(0);
    const [totalScore2 , setTotalScore2] = useState(0);
    const saveScore = (value) => {
        // score[step].score = value;
        // setScore(score);
        if (stateSection.questionSection_2) {
            setTotalScore2(totalScore2 + value);
        } else {
            setTotalScore(totalScore + value);            
        }
        nextStep();
    }
    const saveInfo = (age , sex , start) => {
        let state = stateSection;
        state.start = false;
        state.symptom = true;
        setStateSection(state);

        setSex(sex);
        setage(age);
        setLoading(true);
        setTimeout(() => { 
            setLoading(false);
        }, 1000)
    }
    const saveSymptom = (symptom) => {
        let state = stateSection;
        setTotalScore(0);
        
        setSymptomSectionSelected(symptom);
        if (symptom == 'option1') {
            setMaxStep(3);
            state.symptom = false;
            state.questionSection_1_1 = true;
            setStateSection(state);
        }
        else {
            setMaxStep(1);
            state.symptom = false;
            state.questionSection_1_2 = true;
            setStateSection(state);
        }
    }
    const nextStep = () => {
        setLoading(true);
        setTimeout(() => { 
            setLoading(false);
        }, 1000)

        if (step >= maxStep -1 && !stateSection.questionSection_2) {           
            
            
            // Show Section 2
            let state = stateSection;
            state.questionSection_1_1 = false;
            state.questionSection_1_2 = false;
            state.questionSection_2 = true;
            setStateSection(state);
            
            setMaxStep(5);
            setStep(0);

            return;
        }

        if (step >= maxStep -1 && stateSection.questionSection_2) {            

            // Show Result
            let state = stateSection;
            state.questionSection_2 = false;
            state.showResult = true;
            setStateSection(state);

            return;
        }
        setStep(step + 1);
    }
    const calculateScore = () => {
        let total = 0;
        score.forEach(element => {
            total += element.score;
        });
        return total
    }
    const getResultData = () => {
        const level = [
            'ความเสี่ยงต่ำมาก',
            'ความเสี่ยงต่ำ',
            'ความเสี่ยงปลายกลาง',
            'ความเสี่ยงสูง',
        ]
        if (calculateScore() <= 7)
        {
            return level[0]
        }
        else if (calculateScore() > 7 && calculateScore() <= 14)
        {
            return level[1]
        }
        else if (calculateScore() > 14 && calculateScore() <= 21)
        {
            return level[2]
        }
        else if (calculateScore() > 21)
        {
            return level[3]
        }
    }


    return (
        <>
            <Header />
            <div className="my-5 p-4">



                {stateSection.start &&
                    <AgeSex props={{ sendData: saveInfo }} />
                }

                {stateSection.symptom &&
                    <SymptomSection props={{ sendData: saveSymptom }} />
                }

                {stateSection.questionSection_1_1 &&
                    <>
                    <progress className="progress progress-primary w-full" value={`${step / 9 * 100}`} max="100"></progress>

                    <Title props={{ title: pageTitle[step] }} />
                    {loading && <Skeleton /> }
                    {!loading && 
                    <Question props={{ sendData: saveScore , point : questionTitleSection1_1[step].point }}>
                        <span dangerouslySetInnerHTML={{ __html: questionTitleSection1_1[step].text }} />
                    </Question>
                    }
                    </>
                }

                {stateSection.questionSection_1_2 &&
                    <>
                    <progress className="progress progress-primary w-full" value={`${step / 9 * 100}`} max="100"></progress>

                    <Title props={{ title: pageTitle[step] }} />
                    {loading && <Skeleton /> }
                    {!loading && 
                    <Question props={{ sendData: saveScore , point : questionTitleSection1_2[step].point }}>
                        <span dangerouslySetInnerHTML={{ __html: questionTitleSection1_2[step].text }} />
                    </Question>
                    }
                    </>
                }

                {stateSection.questionSection_2 &&
                    <>
                    <progress className="progress progress-primary w-full" value={`${step / 9 * 100}`} max="100"></progress>

                    <Title props={{ title: pageTitle[step] }} />
                    {loading && <Skeleton /> }
                    {!loading && 
                    <Question props={{ sendData: saveScore , point : questionTitleSection2[step].point }}>
                        <span dangerouslySetInnerHTML={{ __html: questionTitleSection2[step].text }} />
                    </Question>
                    }
                    </>
                }
                
                {stateSection.showResult &&
                    <Result props={{ point1 : totalScore , point2 : totalScore2 , text : getResultData() , sex : sex , age : age }} />
                }
            </div>
        </>
    );
}

