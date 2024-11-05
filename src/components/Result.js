import Image from "next/image";
export default function Result({ props }) {
    return (
        <>
        <div className="bg-[#f2e8ce] rounded-xl overflow-hidden shadow-lg mb-10">
            <div className="bg-primary text-white p-3">
                <h2 className="text-center text-xl">
                    ผลลัพท์
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
                        <p className="text-xl font-medium text-center">ความเสี่ยงของคุณอยู่ในระดับ</p>
                        <p className="text-3xl font-bold text-primary text-center">{props.text}</p>
                    </div>
                </div>
                <div className="mt-5">
                    
                </div>
            </div>
        </div>
        </>
    );
}