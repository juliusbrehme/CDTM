import { Button } from "@/components/ui/button.tsx";
import { X } from "lucide-react";
import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
  col_span?: string;
}

export default function Container({ children , col_span="col-span-1"}: Props) {
  const [showContainer, setShowContainer] = useState(true);

  return (
    showContainer && (
      <div className={`relative ${col_span} flex flex-col gap-4`}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 h-8 w-8 bg-white/80 hover:bg-gray-100"
          onClick={() => setShowContainer(false)}
        >
          <X className="h-4 w-4 text-gray-700" />
        </Button>
        <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in overflow-auto">
          {children}
        </div>
      </div>
    )
  );
}
