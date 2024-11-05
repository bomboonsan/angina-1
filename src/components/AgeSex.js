'use client';
import {useEffect, useState} from "react";
import Swal from 'sweetalert2'
export default function AgeSex({ props }) {
    const [age , setAge] = useState(0);
    const [sex , setSex] = useState(null);
    const handleAge = (age) => {
        setAge(age);
    }
    const submit = () => {
        // props.sendData(age , sex);
        console.log(age , sex);
        if ( sex == null ) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณาเลือกเพศ',
                showConfirmButton: false,
                timer: 1500
            })
            return
        }
        if ( age == 0 ) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณาเลือกช่วงอายุ',
                showConfirmButton: false,
                timer: 1500
            })
            return
        }
        props.sendData(age , sex , true);
    }
    return (
        <>
            <div className="p-3 mt-3">
                <div className="grid grid-cols-2 gap-5">
                    <div 
                        onClick={() => setSex('male')} 
                        className={`
                        cursor-pointer flex items-center justify-center aspect-square rounded-xl bg-neutral-100 shadow hover:shadow-lg hover:scale-[1.03]
                        ${sex == 'male' ? 'bg-primary/20 text-white' : ''}
                        `}
                    >
                        <div className="">
                            <svg className="w-20 h-20 " strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M14.2323 9.74707C13.1474 8.66733 11.6516 8 10 8C6.68629 8 4 10.6863 4 14C4 17.3137 6.68629 20 10 20C13.3137 20 16 17.3137 16 14C16 12.3379 15.3242 10.8337 14.2323 9.74707ZM14.2323 9.74707L20 4M20 4H16M20 4V8" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            <p className="text-center text-xl font-bold text-black">ผู้ชาย</p>
                        </div>
                    </div>

                    <div 
                        onClick={() => setSex('female')} 
                        className={`
                        cursor-pointer flex items-center justify-center aspect-square rounded-xl bg-neutral-100 shadow hover:shadow-lg hover:scale-[1.03]
                        ${sex == 'female' ? 'bg-primary/20 text-white' : ''}
                        `}
                    >
                        <div className="">
                            <svg className="w-20 h-20 " strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15ZM12 15V19M12 21V19M12 19H10M12 19H14" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            <p className="text-center text-xl font-bold text-black">ผู้หญิง</p>
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-xl text-black">ช่วงอายุ</span>
                        </div>
                        <select className="select select-bordered select-lg w-full" onChange={(e) => handleAge(e.target.value)}>
                            <option value={0}>เลือก</option>
                            <option value={1}>30-39</option>
                            <option value={2}>40-49</option>
                            <option value={3}>50-59</option>
                            <option value={4}>60-69</option>
                            <option value={5}>70-80</option>
                        </select>
                    </label>
                </div>
                <div className="mt-10 text-center">
                    <button
                        onClick={submit}
                        className="btn btn-wide btn-primary text-lg text-white"
                    >
                        เริ่มต้น
                    </button>
                </div>
            </div>
        </>
    );
}