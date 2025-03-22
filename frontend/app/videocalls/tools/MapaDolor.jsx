"use client";

import { useState } from "react";
import Body from "./body-highlighter/index";

const MapaDolor = (scale) => {

  const [partsColored, setPartsColored] = useState([])

  function selectColoredParts(partObj,side) {

    const part = partObj.slug
    const op_side = side == "left" ? "right" : "left"
    if (partsColored.some(p => p.slug === part && p.side === undefined)) {
      if (part === "hair" || part === "head") {
        setPartsColored(partsColored.filter(p => p.slug !== part))
      } else {
        setPartsColored([...partsColored.filter(p => p.slug !== part), {slug: part,intensity:2,side:op_side}])
      }
    } else if (partsColored.some(p => p.slug === part && p.side === op_side)) {
      setPartsColored([...partsColored.filter(p => !(p.slug === part && p.side === op_side)), {slug: part,intensity:2}])
    } else if (!partsColored.some(p => p.slug === part && p.side === side)) {
      setPartsColored([...partsColored, {slug: part,intensity:2, side}])
    } else {
      setPartsColored(partsColored.filter(p => !(p.slug === part && p.side === side)))
    }
  }

  return (
    <div className="flex flex-row align-center justify-center">
    <Body
      data={partsColored}
      side="front"
      scale
      border="#dfdfdf"
      onBodyPartPress={selectColoredParts}
    />
    <Body
      data={partsColored}
      side="back"
      scale
      border="#dfdfdf"
      onBodyPartPress={selectColoredParts}
    />
  </div>
  );
  
};

export default MapaDolor;
