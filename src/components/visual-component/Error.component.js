
const Error_component = ({message}) =>
{

    return (
        <>
            <div className="flex justify-center">
                <div className="text-white p-4 grid grid-cols-1 bg-red-800  m-3 p-4 rounded-md shadow-lg">
                    <p className="text-lg text-center font-bold">Oh no...</p>
                    <p className="text-center">Error communicating with server</p>
                    <p className="text-center">{message}</p>
                </div>
            </div>
        </>
    )
}

export default Error_component