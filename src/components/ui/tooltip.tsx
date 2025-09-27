import { useState } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export const Tooltip = ({ content, children, position = "top" }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2"
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute ${positionClasses[position]} z-50`}>
          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded-md shadow-lg whitespace-nowrap max-w-xs">
            {content}
            <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === "top" ? "top-full left-1/2 -translate-x-1/2 -mt-1" :
              position === "bottom" ? "bottom-full left-1/2 -translate-x-1/2 -mb-1" :
              position === "left" ? "left-full top-1/2 -translate-y-1/2 -ml-1" :
              "right-full top-1/2 -translate-y-1/2 -mr-1"
            }`} />
          </div>
        </div>
      )}
    </div>
  );
};
