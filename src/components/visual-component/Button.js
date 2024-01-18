import React, { useEffect, useState } from 'react';

const Button = ({ text, handleOnClick, type }) => {
    const [buttonType, setButtonType] = useState(type);

    useEffect(() => {
        setButtonType(type);
        if (!buttonType)
            setButtonType("Default")
    }, [type, buttonType])

    return (
        <div className='flex justify-center'>
            {
                (buttonType === "Default") ?
                    <input type='button' value={text} onClick={handleOnClick} className="p-4 m-0 pt-2 pb-2 bg-slate-500 text-white rounded-md hover:scale-[1.04] transition-[250ms] drop-shadow-lg" /> :
                    (buttonType === "Delete") ?
                        <input type='button' value={text} onClick={handleOnClick} className='p-4 m-0 pt-2 pb-2 bg-red-700 text-white rounded-md hover:scale-[1.04] transition-[250ms] drop-shadow-lg' /> :
                        <input type='button' value={text} onClick={handleOnClick} className='p-4 m-0 pt-2 pb-2 bg-green-700 text-white rounded-md hover:scale-[1.04] transition-[250ms] drop-shadow-lg' />


            }
        </div>
    );
};

export default Button;