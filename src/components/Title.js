// this is components/Header.js
export default function Title({ props }) {
    return (
        <>
            <div className="p-3 mt-3">
                <div className="p-3 top-bar rounded-3xl shadow">
                    <h1 className="text-center text-xl font-semibold text-primary drop-shadow">{props.title ? props.title : null}</h1>
                </div>
            </div>
        </>
    );
}