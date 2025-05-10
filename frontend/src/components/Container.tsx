import { Button } from "@/components/ui/button.tsx";
import { Box, X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import VegaChart from "@/components/VegaChart.tsx";
import { CircularProgress, Typography } from "@mui/material";

interface Props {
  children?: ReactNode;
  prompt?: string;
  colSpan?: string;
}

export default function Container({ children, prompt, colSpan="col-span-1" }: Props) {
  const [showContainer, setShowContainer] = useState(true);
  const [graph, setGraph] = useState<ReactNode | null>(null);

  useEffect(() => {
    if (prompt) {
      fetch("http://localhost:8000/api/generate-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: prompt }),
      })
        .then((res) => res.json())
        .then((data) => setGraph(() => <VegaChart spec={data} />))
        .catch(console.error);
    }
  }, []);

  if (prompt) {
    return (
      showContainer && (
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 h-8 w-8 bg-white/80 hover:bg-gray-100"
            onClick={() => setShowContainer(false)}
          >
            <X className="h-4 w-4 text-gray-700" />
          </Button>
          <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in h-96 overflow-auto">
            {graph ? (
              graph
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <CircularProgress />
                <Typography variant="subtitle2" className="mt-2">
                  Creating a graph for you ...
                </Typography>
              </div>
            )}
          </div>
        </div>
      )
    );
  }
  return (
    showContainer && (
      <div className={`relative ${colSpan} flex flex-col gap-4`}>
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
