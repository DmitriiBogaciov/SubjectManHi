import React, { useEffect,useState } from "react"
import {useTranslation} from "react-i18next"

//Props
import { CardProps } from "../../props/Card.props"


const Card = (card: CardProps) => {

    const [cardProps, setCardProps] = useState(card);
    useEffect(()=>
    {
        setCardProps(card);
    },[card]);

    const {t} = useTranslation();
    
    return (
            <div className={`bg-slate-100 shadow-md rounded-lg p-2 
                ${(cardProps.cursorEffect === "onHover")?" card-effect-container ":" "}
                ${(cardProps.onClick)?" cursor-pointer ":" "}`}
                onClick={(e)=>(cardProps.onClick)?cardProps.onClick(e):null}>
                <h3 className={"text-lg "+ (cardProps.cursorEffect === "onHover")?"card-effect-header":""}>{cardProps.title}</h3>
                <p className={(cardProps.cursorEffect === "onHover")?"card-effect-description":""}>{(cardProps.text && cardProps.text?.length > 150) ?
                    (<>{cardProps.text?.split(" ").slice(0, 30).map((t,i) => <span key={i}>{t + " "}</span>)}
                        ...
                        <div className="font-bold text-xl pt-5">{t("clickForMore")}</div>
                    </>)
                    : cardProps.text}</p>
            </div>
    )
}

export default Card