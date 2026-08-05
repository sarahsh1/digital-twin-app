import { View, Text, type ViewProps } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

/**
 * Elevated content card -- the shared "bg-surface + border" surface used
 * for grouped detail (settings groups, form sections, chart containers).
 */
export function Card({ className, style, ...props }: ViewProps) {
  const colors = useColors();
  return (
    <View
      className={cn("bg-surface rounded-2xl p-4", className)}
      style={[{ borderWidth: 1, borderColor: colors.border }, style]}
      {...props}
    />
  );
}

type MetricTone = "default" | "primary" | "secondary" | "success" | "warning" | "error";

interface MetricCardProps {
  label: string;
  value: string;
  caption?: string;
  tone?: MetricTone;
  width?: number;
}

/**
 * A single number that matters, with its label and an optional caption --
 * for stat strips and key-result rows. Distinct from Card so a KPI reads
 * with more weight than a plain grouped-content surface.
 */
export function MetricCard({ label, value, caption, tone = "default", width }: MetricCardProps) {
  const colors = useColors();
  const toneColor: Record<MetricTone, string> = {
    default: colors.foreground,
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
  };

  return (
    <View
      className="bg-surface rounded-2xl p-4"
      style={{ borderWidth: 1, borderColor: colors.border, width }}
    >
      <Text style={{ color: toneColor[tone] }} className="text-3xl font-bold">
        {value}
      </Text>
      <Text className="text-muted text-sm mt-1">{label}</Text>
      {caption ? <Text className="text-muted text-xs mt-1">{caption}</Text> : null}
    </View>
  );
}
