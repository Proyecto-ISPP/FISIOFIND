"use client";

import Body from "./body-highlighter/index";

const MapaDolor = ({scale, gender, sendWebSocketMessage, partsColored}) => {

  function sendSelectedParts(parts_to_send) { 
    // Si no se quiere mandar por websocketes porque se quiere utilizar el modelo como una foto
    // se puede pasar la funcion sendWebSocketMessage como una funcion vacia
    sendWebSocketMessage({
      action: 'pain-map',
      message: {
        partsSelected: parts_to_send
      }
    });
  }

  function selectColoredParts(partObj,side) {

    const part = partObj.slug
    const op_side = side == "left" ? "right" : "left"
    if (partsColored.some(p => p.slug === part && p.side === undefined)) {
      if (part === "hair" || part === "head") {
        sendSelectedParts(partsColored.filter(p => p.slug !== part))
      } else {
        sendSelectedParts([...partsColored.filter(p => p.slug !== part), {slug: part,intensity:2,side:op_side}])
      }
    } else if (partsColored.some(p => p.slug === part && p.side === op_side)) {
      sendSelectedParts([...partsColored.filter(p => !(p.slug === part && p.side === op_side)), {slug: part,intensity:2}])
    } else if (!partsColored.some(p => p.slug === part && p.side === side)) {
      sendSelectedParts([...partsColored, {slug: part,intensity:2, side}])
    } else {
      sendSelectedParts(partsColored.filter(p => !(p.slug === part && p.side === side)))
    }
  }
  return (
    <div className="flex flex-row align-center justify-center">
    <Body
      data={partsColored}
      scale={scale}
      gender={gender}
      side="front"
      border="#dfdfdf"
      onBodyPartPress={selectColoredParts}
    />
    <Body
      data={partsColored}
      scale={scale}
      gender={gender}
      side="back"
      border="#dfdfdf"
      onBodyPartPress={selectColoredParts}
    />
  </div>
  );
  
};

export default MapaDolor;
