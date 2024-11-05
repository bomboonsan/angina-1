// this is components/Header.js
export default function Skeleton({ props }) {
    return (
        <>
            <div className="flex w-full flex-col gap-3 p-4">
                <div className="skeleton h-24 w-full"></div>
                <div className="skeleton h-5 w-full"></div>
                <div className="skeleton h-5 w-full"></div>
            </div>
        </>
    );
}