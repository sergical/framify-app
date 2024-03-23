"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { CheckIcon, ClipboardIcon } from "@radix-ui/react-icons";

export interface CopyInput
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  copyText?: string;
}

const CopyInput = React.forwardRef<HTMLButtonElement, CopyInput>(
  ({ text, copyText, className, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);

    const handleClick = () => {
      navigator.clipboard.writeText(copyText || text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <button
        onClick={handleClick}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 items-center justify-between",
          className
        )}
        ref={ref}
        {...props}
      >
        <span className="truncate">{text}</span>

        {copied ? (
          <CheckIcon className="w-4 h-4 ml-2 text-green-800" />
        ) : (
          <ClipboardIcon className="w-4 h-4 ml-2 " />
        )}
      </button>
    );
  }
);
CopyInput.displayName = "CopyInput";

export { CopyInput };
