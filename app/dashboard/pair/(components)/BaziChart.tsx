interface BaziChartProps {
  chineseCharacters: string;
}

export function BaziChart({ chineseCharacters }: BaziChartProps) {
  // Parse the Chinese characters string
  // Assuming format like "甲子 乙丑 丙寅 丁卯" (4 pillars with 8 characters total)
  const characters = chineseCharacters.split(" ");

  const pillars = [
    { name: "Year", characters: characters[0] || "甲子" },
    { name: "Month", characters: characters[1] || "乙丑" },
    { name: "Day", characters: characters[2] || "丙寅" },
    { name: "Hour", characters: characters[3] || "丁卯" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-4 gap-4">
        {pillars.map((pillar, index) => (
          <div key={index} className="text-center">
            <div className="bg-primary/10 rounded-lg p-4 mb-2">
              <div className="text-3xl font-bold text-primary mb-2">
                {pillar.characters.split("").map((char, charIndex) => (
                  <div key={charIndex} className="mb-1">
                    {char}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              {pillar.name} Pillar
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Four Pillars of Destiny (BaZi Chart)
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Year • Month • Day • Hour
        </p>
      </div>
    </div>
  );
}
