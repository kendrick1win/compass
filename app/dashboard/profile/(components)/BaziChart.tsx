import { Card, CardContent } from "@/components/ui/card";

interface BaziChartProps {
  chineseCharacters: string;
}

export function BaziChart({ chineseCharacters }: BaziChartProps) {
  const pillars = chineseCharacters.split("\n");
  const labels = ["Hour", "Day", "Month", "Year"];

  return (
    <div className="flex flex-row justify-between items-center gap-4 w-full">
      {pillars.map((pillar, index) => (
        <div key={index} className="flex-1">
          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-4">
              <div className="font-mono text-2xl tracking-wide text-center whitespace-pre-wrap">
                {pillar}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
