// this is components/Header.js
import Image from "next/image";
export default function Start({ props }) {
    return (
        <>
            {/* <div className="min-h-full flex items-center justify-center">
                TEST
            </div> */}
            <div className="px-3 py-3 bg-[#f7f0df]">
                <h1 className="text-lg font-semibold text-center leading-6 text-primary">
                    ESC 2024 Chronic Coronary Syndromes <br className="hidden sm:block" />
                    <span className="text-[.86rem] sm:text-[.9rem] text-secondary">Risk Factor-weighted Clinical Likelihood model (EF-CL)</span>
                </h1>
            </div>
        </>
    );
}