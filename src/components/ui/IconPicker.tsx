"use client";

import { useState, useRef, useEffect } from "react";
import { iconRegistry } from "@/lib/icons";
import { Icon } from "@/components/ui/icon";

export function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Group icons by categories or just unique values to avoid extreme duplication
  // since registry has multiple keys pointing to same icon sometimes.
  const uniqueKeys = Array.from(new Set(Object.values(iconRegistry)))
    .map((iconComponent) => {
      const entry = Object.entries(iconRegistry).find(
        ([_, v]) => v === iconComponent
      );
      return entry ? entry[0] : "";
    })
    .filter(Boolean);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-surface-container-highest border-outline-variant/30 hover:bg-surface-container-highest/80 flex h-12 w-12 items-center justify-center rounded-lg border transition-colors"
      >
        <Icon
          name={value || "link"}
          className="text-primary-container text-xl"
        />
      </button>

      {isOpen && (
        <div className="bg-surface-container-high border-outline-variant/30 absolute top-14 left-0 z-50 max-h-64 w-64 overflow-y-auto rounded-xl border p-2 shadow-xl">
          <div className="grid grid-cols-6 gap-1">
            {uniqueKeys.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  onChange(k);
                  setIsOpen(false);
                }}
                className={`flex aspect-square items-center justify-center rounded p-1 transition-colors ${
                  value === k
                    ? "bg-primary-container text-on-primary-container"
                    : "hover:bg-primary-container/20 text-slate-300"
                }`}
                title={k}
              >
                <Icon name={k} className="text-xl" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
