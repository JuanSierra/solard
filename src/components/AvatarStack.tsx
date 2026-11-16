interface AvatarStackProps {
  colors: string[];
  size?: "sm" | "md";
}

export function AvatarStack({ colors, size = "sm" }: AvatarStackProps) {
  const dimension = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className="flex -space-x-1.5 items-center">
      {colors.slice(0, 3).map((color, index) => (
        <div
          key={`${color}-${index}`}
          className={`${dimension} rounded-full border border-surface-container-lowest shadow-xs`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}
