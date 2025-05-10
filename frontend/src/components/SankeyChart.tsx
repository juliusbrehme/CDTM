import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

interface Transaction {
  userId: string;
  type: string;
  side: string;
  amount: number;
  bookingDate: string;
  mcc?: string;
  category?: string;
}

interface SankeyData {
  node: {
    label: string[];
    color: string[];
  };
  link: {
    source: number[];
    target: number[];
    value: number[];
    color: string[];
  };
}

const SankeyChart: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sankeyData, setSankeyData] = useState<SankeyData>({
    node: { label: [], color: [] },
    link: { source: [], target: [], value: [], color: [] },
  });
  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/transactions?user=0bf3b550-dc5b-4f3e-91f4-162b687b97c6&start_date=2024-06-01&end_date=2024-06-30")
      .then((res) => res.json())
      .then((data: Transaction[]) => {
        setTransactions(data);

        const nodes: string[] = [];
        const colors: string[] = [];
        const links = {
          source: [] as number[],
          target: [] as number[],
          value: [] as number[],
          color: [] as string[],
        };

        const getColor = (category: "credit" | "income" | "type" | "category" | "creditLine" | "typeLine" | "categoryLine") => {
          switch (category) {
            case "credit": return "#2ac02d"; // kräftiges Grün
            case "income": return "#606060"; // helles Grau
            case "type": return "#d10e1f";
            case "category": return "#d10e1f";    // kräftiges Rot
            // for creditLine TypeLine und MccLine same colors but lighter
            case "creditLine": return "#4cb750"; // light green
            case "typeLine": return "#ff595a"; // light red
            case "categoryLine": return "#ff595a"; // light red
            default: return "#000000"; // default color
          }
        };

        const incomeLabel = "Total Income";
        nodes.push(incomeLabel);
        colors.push(getColor("income")!);
        const incomeIndex = 0;

        data.forEach((transaction) => {
          if (transaction.side === "CREDIT") {
            const creditNode = `Income ${capitalize(transaction.type)}`;
            if (!nodes.includes(creditNode)) {
              nodes.push(creditNode);
              colors.push(getColor("credit")!);
            }
            const creditIndex = nodes.indexOf(creditNode);

            // CREDIT → Income
            links.source.push(creditIndex);
            links.target.push(incomeIndex);
            links.value.push(transaction.amount);
            links.color.push(getColor("creditLine")!);
          }

          if (transaction.side === "DEBIT") {
            const typeNode = `Expenses by ${capitalize(transaction.type)}`;
            if (!nodes.includes(typeNode)) {
              nodes.push(typeNode);
              colors.push(getColor("type")!);
            }
            const typeIndex = nodes.indexOf(typeNode);

            // Income → Type
            links.source.push(incomeIndex);
            links.target.push(typeIndex);
            links.value.push(transaction.amount);
            links.color.push(getColor("typeLine")!);

            if (transaction.type === "CARD" && transaction.category) {
              const categoryNode = `${transaction.category}`;
              if (!nodes.includes(categoryNode)) {
                nodes.push(categoryNode);
                colors.push(getColor("category")!);
              }
              const categoryIndex = nodes.indexOf(categoryNode);

              // Type → Category
              links.source.push(typeIndex);
              links.target.push(categoryIndex);
              links.value.push(transaction.amount);
              links.color.push(getColor("categoryLine")!);
            }
          }
        });

        setSankeyData({
          node: { label: nodes, color: colors },
          link: {
            source: links.source,
            target: links.target,
            value: links.value,
            color: links.color,
          },
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div className="mb-4 items-center animate-fade-in p-6 mx-auto">
      <h3 className="text-lg text-gray-700 font-bold">
        Transaction Flow
      </h3>
      <p className="text-gray-500">Analyze all your cashflows</p>
      <Plot
        data={[
          {
            type: "sankey",
            orientation: "h",
            node: {
              pad: 20,
              thickness: 30,
              label: sankeyData.node.label,
              color: sankeyData.node.color,
              align: "right"
            },
            link: {   
              source: sankeyData.link.source,
              target: sankeyData.link.target,
              value: sankeyData.link.value,
              color: sankeyData.link.color,
            },
          },
        ]}
        layout={{
          font: { 
            size: 15,
            color: "#202020",
            weight: "semibold",
          },
          height: 700,
          margin: { l: 20, r: 20, t: 20, b: 20 },
          plot_bgcolor: "transparent",
          paper_bgcolor: "transparent",
        }}
        config={{ responsive: true }}
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default SankeyChart;
