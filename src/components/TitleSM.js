// this is components/Header.js
export default function TitleSM({ props }) {
    return (
        <>
            <div className="p-3 mt-3">
                <div className="p-3 px-1 top-bar rounded-3xl shadow">
                    <h1 className="text-center text-sm font-semibold text-primary drop-shadow">{props.title ? props.title : null}</h1>
                </div>
            </div>
        </>
    );
}