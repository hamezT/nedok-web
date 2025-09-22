import * as React from "react";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, width = 161, height = 64, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      <img
        src="/sidebar-header.svg"
        alt="Nedok Logo"
        width={width}
        height={height}
        className="h-auto max-w-full"
      />
    </div>
  )
);
Logo.displayName = "Logo";

export { Logo };
