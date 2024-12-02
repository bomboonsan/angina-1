'use client';
import {useEffect, useState} from "react";
import Swal from 'sweetalert2'
export default function Question({ props , children }) {
    const questions = props.questions;
    const [score , setScore] = useState([]);
    const handleCheckBox = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;
        const index = e.target.id;
        const newScore = [...score];
        if (isChecked) {
            newScore[index] = parseInt(value);
            setScore(newScore);
        } else {
            newScore[index] = 0;
            setScore(newScore);
        }
    }
    const submit = () => {
        let totalScore = 0;
        score.forEach((item , index) => {
            if (item > 0) {
                totalScore += item;
            }            
        })
        props.sendData(totalScore);
        // console.log(totalScore);
    }
    return (
        <>
            {questions.map((question , index) => {
                return (
                    <div key={index}>
                        <div className="p-3 py-1 mt-2">
                            <div className="p-3 top-bar rounded-3xl shadow flex gap-2">

                                <div className="inline-flex items-center w-12">
                                    <label className="flex items-center cursor-pointer relative">
                                        <input onChange={handleCheckBox} value={question.point} id={index} type="checkbox" className="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded-full bg-slate-100 shadow hover:shadow-md border border-primary checked:bg-primary checked:border-primary" />
                                        <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                        </span>
                                    </label>
                                </div>

                                <div className="flex-1">
                                    <span dangerouslySetInnerHTML={{ __html: question.text }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
            <div className="my-5 text-center">
                <button onClick={submit} className="btn btn-wide btn-primary text-lg text-white">
                    {props.lang == "en" ? "Send" : "ส่งคำตอบ"}
                </button>
            </div>
        </>
    );
}