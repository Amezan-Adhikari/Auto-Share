import { dpMap } from "@/app/data/demat-providers-map";
import { useState, useRef, useEffect } from "react";

// Add this component above AddCreds:
export function DPSelect({
  value,
  onChange,
  error,
}: {
  value: number | undefined;
  onChange: (id: number) => void;
  error?: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = dpMap.find((d) => d.clientId === value);

  const filtered = query.trim()
    ? dpMap.filter((d) =>
        d.clientName.toLowerCase().includes(query.toLowerCase())
      )
    : dpMap;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        // Reset query to selected name if nothing chosen
        if (selected) setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [selected]);

  return (
    <div ref={containerRef} className="relative">
      <div
        className={`flex items-center border rounded-lg px-3 py-2.5 bg-background transition-colors ${
          open
            ? "border-primary ring-1 ring-primary/30"
            : error
            ? "border-red-400"
            : "border-foreground/20 hover:border-foreground/40"
        }`}
      >
        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          placeholder="Search your DP..."
          value={open ? query : (selected?.clientName ?? query)}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
        />
        {/* Chevron icon */}
        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {open && (
        <ul className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-lg border border-foreground/15 bg-background shadow-lg text-sm">
          {filtered.length === 0 ? (
            <li className="px-3 py-2.5 text-muted-foreground">No results found</li>
          ) : (
            filtered.map((item) => (
              <li
                key={item.clientId}
                onMouseDown={() => {
                  onChange(item.clientId);
                  setQuery("");
                  setOpen(false);
                }}
                className={`px-3 py-2.5 cursor-pointer transition-colors hover:bg-muted ${
                  item.clientId === value ? "bg-primary/10 font-medium text-primary" : ""
                }`}
              >
                {item.clientName}
              </li>
            ))
          )}
        </ul>
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}