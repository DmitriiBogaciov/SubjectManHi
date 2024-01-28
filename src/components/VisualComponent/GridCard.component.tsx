import "bootstrap/dist/css/bootstrap.css";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

//Custom Components
import Card from "./Card.component.tsx";

//Props
import { GridCardProps } from "../../props/GridCard.props";

export default function GridCard(grid_card: GridCardProps) {

  const [gridCard, setGridCard] = useState<GridCardProps>(grid_card);
  const { t } = useTranslation()

  useEffect(() => {
    setGridCard(grid_card);
  }, [grid_card])



  return (

    <div className={"grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}>
      {
        (gridCard.card_items && gridCard.card_items.length > 0) ?
          gridCard.card_items.map((card, i) => {
            return <div className="p-2">
              <Card key={i} title={card.title} text={card.text} value={card.value} cursorEffect={card.cursorEffect} onClick={card.onClick}></Card>
            </div>
          })
          : (gridCard.shown_when_empty) ?
          <div>
            <p> {t("list.empty")}</p>
          </div> 
          : null
      }
    </div >

  )
}
