import { PuffLoader } from "react-spinners"


const Loading_component = () =>
{
    return (
        <>
            <div className="p-5 flex justify-center">
                <PuffLoader></PuffLoader>
            </div>
        </>
    )
}

export default Loading_component