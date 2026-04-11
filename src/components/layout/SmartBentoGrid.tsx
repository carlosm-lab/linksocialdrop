import React, { ReactNode } from "react";

interface SmartBentoGridProps {
  children: ReactNode;
  isBento: boolean;
}

/**
 * A highly optimized, responsive masonry/bento layout engine.
 * Automatically distributes children into an aesthetically pleasing mosaic.
 */
export function SmartBentoGrid({ children, isBento }: SmartBentoGridProps) {
  if (!isBento) {
    return <div className="w-full space-y-4">{children}</div>;
  }

  // Bento Mosaic Pattern Engine
  // Depending on the index, we assign different spans to create a true Bento feel.
  const getBentoClasses = (index: number) => {
    // Pattern sequence lengths:
    // 0: Full width banner
    // 1: Half
    // 2: Half
    // 3: Half
    // 4: Full width
    // 5: Half
    const patternPos = index % 5;

    if (patternPos === 0 || patternPos === 3) {
      return "col-span-2 row-span-1";
    }

    return "col-span-1 row-span-1";
  };

  return (
    <div className="grid w-full auto-rows-[minmax(120px,auto)] grid-cols-2 gap-4">
      {React.Children.toArray(children).map((child, i) => (
        <div key={i} className={`flex h-full w-full ${getBentoClasses(i)}`}>
          {child}
        </div>
      ))}
    </div>
  );
}
