import React from "react"
import {useTranslation} from "react-i18next"

//Props
import { CardProps } from "../../props/Card.props"


const Card = (card: CardProps) => {

    const {t} = useTranslation();
    return (
            <div className={`bg-slate-100 shadow-md rounded-lg p-2 ${(card.cursorEffect === "onHover")?"card-effect-container":""}`}>
                <h3 className={"text-lg "+ (card.cursorEffect === "onHover")?"card-effect-header":""}>{card.title}</h3>
                <p className={(card.cursorEffect === "onHover")?"card-effect-description":""}>{(card.text && card.text?.length > 150) ?
                    (<>{card.text?.split(" ").slice(0, 30).map((t,i) => <span key={i}>{t + " "}</span>)}
                        ...
                        <div className="font-bold text-xl pt-5">{t("clickForMore")}</div>
                    </>)
                    : card.text}</p>
            </div>
    )
}

export default Card