"use client";

import * as React from "react";

const Button = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? "span" : "button";
  return (
    <Comp
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none
        bg-[#0056A3] text-white px-4 py-2 hover:bg-[#004080] ${className}`}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };
