// this is components/Header.js
import Image from "next/image";
export default function Header({ props }) {
    return (
        <>
            <div className="relative z-0">
                <div className="absolute -top-[25%] -left-2 w-32 h-32 z-0">
                    <Image
                        src="/img/bg-l.png"
                        alt="AC"
                        width={400}
                        height={400}
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
        </>
    );
}