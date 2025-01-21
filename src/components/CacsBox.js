// this is components/Header.js
export default function CacsBox({ props }) {
    const { RF_PTP, cacs_cs } = props;
    return (
        <>
            <div className='mt-10 p-4 bg-white shadow-md border border-neutral-400/10 rounded-lg'>
                <p>
                    <span className='font-semibold inline-block w-[80px] text-primary'>CACS CL</span>  <span className="">:</span> <span className="ml-4">{cacs_cs} %</span>
                </p>
                <p>
                    <span className='font-semibold inline-block w-[80px] text-primary'>RF_PTP</span> <span className="">:</span> <span className="ml-4">{RF_PTP} %</span>
                </p>
            </div>
        </>
    );
}