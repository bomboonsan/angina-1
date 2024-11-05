'use client';
import Image from "next/image";
import Header from "@/components/Header";
import Title from "@/components/Title";
import AgeSex from "@/components/AgeSex";
import Question from "@/components/Question";
import Skeleton from "@/components/Skeleton";
import Result from "@/components/Result";

import { useEffect, useState } from "react";

import pageTitle from '@/data/pageTitle.json'
import questionTitle from '@/data/questionTitle.json'

export default function Home() {
    const [start , setStart] = useState(false);
    const [loading , setLoading] = useState(false);
    const [showResult , setShowResult] = useState(false);
    const [sex , setSex] = useState(null);
    const [age , setage] = useState(null);
    const [step , setStep] = useState(0);
    const [result , setResult] = useState(null);
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
    const saveScore = (value) => {
        score[step].score = value;
        setScore(score);
        nextStep();
    }
    const saveInfo = (age , sex , start) => {
        setStart(start);
        setSex(sex);
        setage(age);
        setLoading(true);
        setTimeout(() => { 
            setLoading(false);
        }, 1000)
    }
    const nextStep = () => {
        setLoading(true);
        setTimeout(() => { 
            setLoading(false);
        }, 1000)
        if (step === 8) {
            setShowResult(true);
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
                {!start && !showResult &&
                    <AgeSex props={{ sendData: saveInfo }} />
                }
                {start && !showResult &&
                    <>
                    <progress className="progress progress-primary w-full" value={`${step / 9 * 100}`} max="100"></progress>

                    <Title props={{ title: pageTitle[step] }} />
                    {loading && <Skeleton /> }
                    {!loading && 
                    <Question props={{ sendData: saveScore , point : questionTitle[step].point }}>
                        <span dangerouslySetInnerHTML={{ __html: questionTitle[step].text }} />
                    </Question>
                    }
                    </>
                }
                {
                    showResult &&
                    <Result props={{ point : calculateScore() , text : getResultData() , sex : sex , age : age }} />
                }
            </div>
        </>
    );
}

