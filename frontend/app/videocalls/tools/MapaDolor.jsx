"use client";

import Body from "./body-highlighter/index";

const MapaDolor = ({scale, gender, sendWebSocketMessage, partsColoredFront, partsColoredBack}) => {

  function sendSelectedParts(parts_to_send,side) { 
    // Si no se quiere mandar por websocketes porque se quiere utilizar el modelo como una foto
    // se puede pasar la funcion sendWebSocketMessage como una funcion vacia
    sendWebSocketMessage({
      action: 'pain-map',
      message: {
        side,
        partsSelected: parts_to_send
      }
    });
  }

  function selectColoredParts(partObj,side, bodyPerspective) {
    let partsColored;
    if (bodyPerspective === "front") {
      partsColored = partsColoredFront
    } else if (bodyPerspective === "back") {
      partsColored = partsColoredBack
    } else {
      console.log("Bad perspective selected")
      return
    }

    const part = partObj.slug
    const op_side = side == "left" ? "right" : "left"
    if (partsColored.some(p => p.slug === part && p.side === undefined)) {
      if (part === "hair" || part === "head") {
        sendSelectedParts(partsColored.filter(p => p.slug !== part), bodyPerspective)
      } else {
        sendSelectedParts([...partsColored.filter(p => p.slug !== part), {slug: part,intensity:2,side:op_side}], bodyPerspective)
      }
    } else if (partsColored.some(p => p.slug === part && p.side === op_side)) {
      sendSelectedParts([...partsColored.filter(p => !(p.slug === part && p.side === op_side)), {slug: part,intensity:2}], bodyPerspective)
    } else if (!partsColored.some(p => p.slug === part && p.side === side)) {
      sendSelectedParts([...partsColored, {slug: part,intensity:2, side}], bodyPerspective)
    } else {
      sendSelectedParts(partsColored.filter(p => !(p.slug === part && p.side === side)), bodyPerspective)
    }
  }

  return (
    <div className="flex flex-row align-center justify-center">
    <Body
      data={partsColoredFront}
      scale={scale}
      gender={gender}
      side="front"
      border="#dfdfdf"
      onBodyPartPress={(partObj, side) => selectColoredParts(partObj,side,"front")}
    />
    <Body
      data={partsColoredBack}
      scale={scale}
      gender={gender}
      side="back"
      border="#dfdfdf"
      onBodyPartPress={(partObj, side) => selectColoredParts(partObj,side,"back")}
    />
  </div>
  );
  
};

export default MapaDolor;
