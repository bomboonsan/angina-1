'use client';
import {useEffect, useState} from "react";
import Image from "next/image";
export default function CacsclInput({ props }) {
    const [score , setScore] = useState('');
    const sendCacsScore = (score) => {
        const newScore = parseInt(score);
        if (isNaN(newScore)) {
            // return;
            setScore(0);
        }
        if (newScore < 0) {
            // return;
            setScore(0);
        }
        
        setScore(newScore);
        props.sendCacsScore(newScore);
    }
    return (
        <>
            <div className="relative z-0">
                <div className="mt-10 mb-5">
                    <div className="bg-[#e8e5ef] rounded-xl overflow-hidden shadow-lg p-3">
                        <p className="label-text text-xl text-black text-center">
                            {
                                props.lang == 'th' ? 'กรุณาระบุค่า CACS' : 'Please specify CACS value.'
                            }
                        </p>
                    </div>
                </div>
                <label className="input input-bordered shadow-md flex items-center gap-2">
                    <span className="text-primary font-bold">
                            {
                                props.lang == 'th' ? 'ค่า CACS' : 'CACS SCORE'
                            }
                    </span> 
                    <input 
                        min="0"
                        onChange={(e) => sendCacsScore(e.target.value)} 
                        type="number" 
                        className="grow"
                        value={score} 
                        placeholder="0" 
                    />
                    {/* <div>
                        <button className="btn btn-primary rounded-l-none">SUBMIT</button>
                    </div> */}
                </label>
            </div>
        </>
    );
}