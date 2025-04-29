"use client"; // Indica que este archivo debe ejecutarse en el cliente

import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'animated-icons': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

interface AnimatedIconsProps {
  src: string;
  trigger: string;
  attributes: string;
  height: string;
  width: string;
}

const AnimatedIcons: React.FC<AnimatedIconsProps> = ({
  src,
  trigger,
  attributes,
  height,
  width,
}) => {
  return (
    <animated-icons
      src={src}
      trigger={trigger}
      attributes={attributes}
      height={height}
      width={width}
    ></animated-icons>
  );
};

export default AnimatedIcons;
