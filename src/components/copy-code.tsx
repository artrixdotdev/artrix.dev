"use client";

import { Button } from "@heroui/react";
import { Copy } from "lucide-react";
import { addToast } from "@heroui/react";

export const CopyCode: React.FC<{ code: string }> = ({ code }) => {
   const onPress = () => {
      navigator.clipboard.writeText(code);
      addToast({
         title: "Copied to clipboard",
         color: "success",
      });
   };
   return (
      <Button
         variant="light"
         size="sm"
         className="p-0 rounded w-12 h-12"
         onPress={onPress}
      >
         <Copy />
      </Button>
   );
};
