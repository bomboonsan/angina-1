'use client';
import { useCookies } from 'next-client-cookies';
import Image from "next/image";
import {useEffect, useState} from "react";
import { useRouter } from 'next/navigation'
export default function Result({ props }) {
    const router = useRouter();
    const cookies = useCookies();
    const [cad , setCad] = useState(0);
    const getResultData = () => {
        // props.point1 , props.point2 , props.sex , props.age
        const table = {
            Women: {
                1: [
                    [0, 1, 2], 
                    [1, 1, 3], 
                    [1, 2, 5], 
                    [2, 4, 7], 
                    [4, 7, 11],
                ],
                2: [
                    [0, 1, 3], 
                    [1, 2, 5], 
                    [2, 3, 7], 
                    [3, 6, 11], 
                    [6, 10, 16],
                ],
                3: [
                    [2, 5, 10], 
                    [4, 7, 12], 
                    [6, 10, 15], 
                    [10, 14, 19], 
                    [16, 19, 23],
                ],
            },
            Men: {
                1: [
                    [1, 2, 5], [2, 4, 8], [4, 8, 12], [8, 12, 17], [15, 19, 24],
                ],
                2: [
                    [2, 4, 8], [3, 6, 12], [6, 11, 17], [12, 17, 25], [22, 27, 34],
                ],
                3: [
                    [9, 14, 22], [14, 20, 27], [21, 27, 33], [32, 35, 39], [44, 44, 45],
                ],
            },
        };
        const { point1, point2, sex, age } = props;
        console.log(point1, point2, sex, Number(age));
        const gender = sex === "male" ? "Men" : "Women";
        const point2Final = Math.floor(point2 / 2);
        const genderTable = table[gender];
        // ดึงค่าจากตาราง
        if (point1 == 0) return 0;
        const result = genderTable[point1][Number(age)-1][point2Final]; // คำนวณผลลัพธ์
        // cookies.set('RF_PTP' , Number(result));
        return result
    }
    const getRiskLevel = (value) => {
        if (value >= 0 && value <= 6) {
            if (props.lang == "th") return "ต่ำมาก";
            if (props.lang == "en") return "Very low";
        }; // สีฟ้า
        if (value >= 7 && value <= 15) {
            if (props.lang == "th") return "ต่ำ";
            if (props.lang == "en") return "Low";
        }; // สีเขียว
        if (value >= 16) {
            if (props.lang == "th") return "ปานกลาง";
            if (props.lang == "en") return "Moderate";
        }; // สีเหลือง
        return "Unknown"; // กรณีไม่มีในช่วง
    };
    useEffect(() => {
        setCad(getResultData());
        cookies.set('RF_PTP' , Number(getResultData()));
    } , [props.point1 , props.point2 , props.sex , props.age])
    

    return (
        <>
        <div className="bg-[#f2e8ce] rounded-xl overflow-hidden shadow-lg mb-10">
            <div className="bg-primary text-white p-3">
                <h2 className="text-center text-xl">
                    {props.lang == "en" ? "Results" : "ผลลัพท์"}
                </h2>
            </div>
            <div className="p-5">
                <div className="flex flex-col gap-5 items-center justify-center">
                    <div>
                    <Image 
                        src="/img/hearth.png"
                        alt="hearth"
                        width={400}
                        height={400}
                        className="h-24 w-auto block"
                    />
                    </div>
                    <div className="flex-initial">
                        <p className="text-xl font-medium text-center">{props.lang == "en" ? "Clinical likelihood" : "ความเสี่ยงของคุณอยู่ในระดับ"}</p>
                        <p className={cad < 7 ? "text-3xl font-bold text-center text-[#74b8e4]" : cad >= 7 && cad < 17 ? "text-3xl font-bold text-center text-[#45bc8d]" : cad >= 17 ? "text-3xl font-bold text-center text-[#c7c246]" : "" }>{getRiskLevel(getResultData())}</p>
                        <div className="text-center mt-5">
                            {/* <p className="text-xl font-bold text-center text-primary">CAD</p> */}
                            <span className={cad < 7 ? "inline-flex aspect-square items-center justify-center text-3xl bg-[#74b8e4] text-white w-24 h-24 rounded-full" : cad >= 7 && cad < 17 ? "inline-flex aspect-square items-center justify-center text-3xl bg-[#45bc8d] text-white w-24 h-24 rounded-full" : cad >= 17 ? "inline-flex aspect-square items-center justify-center text-3xl bg-[#c7c246] text-white w-24 h-24 rounded-full" : "" }>
                                {getResultData()} <span className='text-base'>%</span>
                            </span>

                        </div>
                    </div>
                </div>
                <div className="mt-5">
                    
                </div>
            </div>
        </div>

        <div className='text-center'>
            <button className="btn btn-primary btn-wide" onClick={() => router.push('/secondary')}>{props.lang == "en" ? "Adjust clinical likelihood" : "ปรับความน่าจะเป็นทางคลินิก"}</button>
        </div>
        </>
    );
}
