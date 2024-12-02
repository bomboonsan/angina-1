'use client';
import {useEffect, useState} from "react";
import Image from "next/image";
export default function LangSwitch({ props }) {
    const [lang, setLang] = useState("en");
    const handleLang = (lang) => {
        setLang(lang);
        props.sendLang(lang);
    }
    return (
        <>
        <div className="flex justify-end gap-2 items-center">
            <div>
                <button className={`flex gap-2 items-center font-bold hover:text-primary ${lang == "en" ? "text-primary" : ""}`} onClick={() => handleLang("en")}>
                    English
                </button>
            </div>
            <div className="w-[3px] h-5 bg-[#b08e1f]"></div>
            <div>
                <button className={`flex gap-2 items-center font-bold hover:text-primary ${lang == "th" ? "text-primary" : ""}`} onClick={() => handleLang("th")}>
                    ภาษาไทย
                </button>
            </div>
        </div>
        </>
    );
}