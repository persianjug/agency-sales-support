"use client";

import * as React from "react";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const sizeVariants = {
  sm: {
    box: "size-6 rounded-md",
    icon: "size-3.5",
    text: "text-sm",
  },
  md: {
    box: "size-8 rounded-lg",
    icon: "size-4",
    text: "text-base",
  },
  lg: {
    box: "size-10 rounded-xl",
    icon: "size-5",
    text: "text-xl",
  },
  xl: {
    box: "size-12 rounded-xl",
    icon: "size-6",
    text: "text-2xl",
  },
};

type LogoProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textClassName?: string;
};

export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  (
    {
      size = "md",
      showText = true,
      className,
      textClassName,
      ...props
    },
    ref
  ) => {
    const variant = sizeVariants[size];

    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-2 select-none", className)}
        {...props}
      >
        {/* ロゴアイコン背景 */}
        <div
          className={cn(
            "flex aspect-square items-center justify-center bg-primary text-primary-foreground shrink-0",
            variant.box
          )}
        >
          <Shield className={variant.icon} />
        </div>

        {/* ロゴテキスト */}
        {showText && (
          <span
            className={cn(
              "font-bold tracking-wide text-foreground truncate",
              variant.text,
              textClassName
            )}
          >
            LOGO
          </span>
        )}
      </div>
    );
  }
);

Logo.displayName = "Logo";

export default Logo;