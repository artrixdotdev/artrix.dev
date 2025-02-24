"use client";
import React, { Suspense, useRef } from "react";
import {
   AnimatePresence,
   motion,
   Reorder,
   useDragControls,
   DragControls,
} from "framer-motion";
import { tv } from "tailwind-variants";
import { cn } from "@heroui/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Grip } from "lucide-react";
import { Skeleton } from "@heroui/react";

// Types and Constants
export type BentoSizes = "compact" | "wide" | "tall" | "canvas";
export const sizes: BentoSizes[] = ["compact", "wide", "tall", "canvas"];

// Styles
const bentoStyles = tv({
   base: "w-full rounded h-full relative from-content1 border border-default-200 bg-opacity-75 to-background bg-gradient-to-tr",
   variants: {
      size: {
         compact: "col-span-1 row-span-1 aspect-square",
         wide: "col-span-4 row-span-2",
         tall: "col-span-2 row-span-4",
         canvas: "col-span-4 row-span-4",
      },
   },
   defaultVariants: { size: "compact" },
});

// Helper function to get next size
const getNextSize = (
   currentSize: BentoSizes,
   direction: "increase" | "decrease",
): BentoSizes => {
   const sizeIndex = sizes.indexOf(currentSize);
   if (direction === "increase") {
      return sizes[Math.min(sizeIndex + 1, sizes.length - 1)];
   }
   return sizes[Math.max(sizeIndex - 1, 0)];
};

// Resizer Component
interface ResizerProps {
   position: "tl" | "tr" | "bl" | "br";
   size: BentoSizes;
   setSize: (size: BentoSizes) => void;
}

const Resizer: React.FC<ResizerProps> = ({ position, size, setSize }) => {
   const dragStartPos = useRef<{ x: number; y: number } | null>(null);

   const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
      dragStartPos.current = { x: e.clientX, y: e.clientY };
   };

   const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
      if (!dragStartPos.current || !e.clientX || !e.clientY) return;

      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;
      const threshold = 5;

      if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
         const isIncreasing = deltaX + deltaY > 0;
         setSize(getNextSize(size, isIncreasing ? "increase" : "decrease"));
         dragStartPos.current = { x: e.clientX, y: e.clientY };
      }
   };

   return (
      <div
         draggable
         onDragStart={handleDragStart}
         onDragEnter={handleDrag}
         className={cn(
            "absolute w-4 h-4 border-2 border-default cursor-nwse-resize",
            "opacity-0 hover:opacity-100 transition-opacity duration-200",
            {
               "top-0 left-0 border-t-2 border-r-2": position === "tl",
               "top-0 right-0 border-t-2 border-r-2": position === "tr",
               "bottom-0 left-0 border-b-2 border-l-2": position === "bl",
               "bottom-0 right-0 border-b-2 border-l-2": position === "br",
            },
         )}
      />
   );
};

// BentoGrid Component
interface BentoGridProps extends React.HTMLAttributes<HTMLUListElement> {
   items: string[];
   name: string;
   children: React.ReactNode;
}

export const BentoGrid = React.forwardRef<HTMLUListElement, BentoGridProps>(
   ({ name, children, className, items: initialItems, ...props }, ref) => {
      const [items, setItems] = useLocalStorage<string[]>(
         `bento-${name}`,
         initialItems,
      );
      const childrenArray = React.Children.toArray(children);
      const orderedChildren = items?.map((id) =>
         childrenArray.find(
            (child) => React.isValidElement(child) && child.key === `.$${id}`,
         ),
      );

      return (
         <Reorder.Group
            as="ul"
            axis="y"
            values={items || []}
            onReorder={setItems}
            className={cn(
               "grid",
               "grid-cols-[repeat(auto-fill,var(--cell-size))]",
               "auto-rows-[var(--cell-size)]",
               "w-full gap-4 p-6 place-items-center",
               "max-h-[calc(4*var(--cell-size)+5*1rem)]",
               className,
            )}
            style={
               {
                  "--cell-size": "min(15vw, 156px)",
                  gridAutoFlow: "row",
               } as React.CSSProperties
            }
            ref={ref}
            {...props}
         >
            <AnimatePresence>{orderedChildren}</AnimatePresence>
         </Reorder.Group>
      );
   },
);

BentoGrid.displayName = "BentoGrid";

// BentoBox Component
interface BentoBoxProps extends React.HTMLAttributes<HTMLLIElement> {
   size: BentoSizes;
   id?: string;
}

export const BentoBox = React.forwardRef<HTMLLIElement, BentoBoxProps>(
   ({ size, className, children, ...props }, ref) => {
      const controls = useDragControls();
      const value = props.id || Math.random().toString();
      const [currentSize, setCurrentSize] = useLocalStorage<BentoSizes>(
         value,
         size,
      );

      return (
         <Reorder.Item
            ref={ref}
            value={value}
            drag
            className={cn(
               "relative",
               bentoStyles({ size: currentSize || size }),
               className,
            )}
            dragListener={currentSize === "compact"}
            dragControls={controls}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layout
            {...(props as any)}
         >
            <Resizer
               position="br"
               size={currentSize || size}
               setSize={setCurrentSize}
            />
            {children}
            {currentSize !== "compact" && (
               <Grip
                  onPointerDown={(e) => controls.start(e)}
                  className="absolute cursor-grab hover:text-foreground transition-colors text-default top-0 right-0 m-3"
               />
            )}
         </Reorder.Item>
      );
   },
);

BentoBox.displayName = "BentoBox";
