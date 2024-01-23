import React from "react"
import DotLoader from "react-spinners/MoonLoader"

const Loading = () =>
{
    return (
        <>
            <div className="p-5 flex justify-center">
                <DotLoader
                loading = {true}
                size = {100}
                color={"black"}
                ></DotLoader>
            </div>
        </>
    )
}

export default Loading
