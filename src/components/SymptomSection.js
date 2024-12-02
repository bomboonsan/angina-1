'use client';
import {useEffect, useState} from "react";
export default function SymptomSection({ props }) {
    const [Symptom , setSymptom] = useState(null);
    useEffect(() => {
        if (Symptom != null) {
            setTimeout(() => { 
                props.sendData(Symptom);
            }, 600)
        }
    } , [Symptom])
    const handleSymptom = (symptom) => {
        setSymptom(symptom);
    }
    return (
        <>
            <div className="relative z-0">
                <div className="py-3 mt-3">
                    <div className="p-3 top-bar rounded-3xl shadow">
                        <h1 className="text-center text-xl font-semibold text-primary drop-shadow">คุณมีอาการแบบไหน</h1>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <div 
                        onClick={() => handleSymptom('option1')} 
                        className={`
                        cursor-pointer flex items-center justify-center aspect-[2/1] rounded-xl bg-neutral-100 shadow hover:shadow-lg hover:scale-[1.03]
                        ${Symptom == 'option1' ? 'bg-primary/20 text-white' : ''}
                        `}
                    >
                        <div className="">
                            <p className="text-center text-xl font-bold text-black">เจ็บหน้าอก</p>
                        </div>
                    </div>

                    <div 
                        onClick={() => handleSymptom('option2')} 
                        className={`
                        cursor-pointer flex items-center justify-center aspect-[2/1] rounded-xl bg-neutral-100 shadow hover:shadow-lg hover:scale-[1.03]
                        ${Symptom == 'option2' ? 'bg-primary/20 text-white' : ''}
                        `}
                    >
                        <div className="">
                            <p className="text-center text-xl font-bold text-black">หายใจลำบาก</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}