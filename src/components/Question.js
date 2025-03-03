'use client';
import {useEffect, useState} from "react";
import Swal from 'sweetalert2'
export default function Question({ props , children }) {
    const point = props.point;
    const [score , setScore] = useState(null);
    const handleScore = (score) => {
        setScore(score);
    }
    const submit = () => {
        if (score == null) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณาเลือกคำตอบ',
                showConfirmButton: false,
                timer: 1500
            })
            return
        }
        props.sendData(score);
    }
    useEffect(() => {
        setScore(null);        
    } , [])
    return (
        <>
            <div className="bg-[#e8e5ef] rounded-xl overflow-hidden shadow-lg mb-10">
                <div className="bg-primary text-white p-3">
                    <h2 className="text-center text-xl">
                        {children}
                    </h2>
                </div>
                <div className="space-y-4 p-4">
                    <div className="form-control border rounded-xl px-4 bg-white shadow">
                        <label className="label cursor-pointer justify-start gap-5">
                            <input type="radio" name="radio-10" className="radio checked:bg-secondary" onChange={() => handleScore(point)} />
                            <span className="label-text text-lg">ใช่</span>
                        </label>
                    </div>
                    <div className="form-control border rounded-xl px-4 bg-white shadow">
                        <label className="label cursor-pointer justify-start gap-5">
                            <input type="radio" name="radio-10" className="radio checked:bg-secondary" onChange={() => handleScore(0)} />
                            <span className="label-text text-lg">ไม่ใช่</span>
                        </label>
                    </div>
                </div>
            </div>
            <div className="text-center">
                <button onClick={submit} className="btn btn-wide btn-primary text-lg text-white">ถัดไป</button>
            </div>
        </>
    );
}