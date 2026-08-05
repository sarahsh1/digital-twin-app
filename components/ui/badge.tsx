import { View, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";

type BadgeTone = "sample" | "success" | "warning" | "error" | "neutral";

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

/**
 * Small status/tag pill. Consolidates the `bg-x/20` + `text-x` pattern
 * repeated ad hoc across screens (Verified/Pending, Sample, etc.) into one
 * reusable component.
 */
export function Badge({ label, tone = "neutral" }: BadgeProps) {
  const colors = useColors();
  const toneColor: Record<BadgeTone, string> = {
    sample: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    neutral: colors.muted,
  };
  const color = toneColor[tone];

  return (
    <View
      style={{
        backgroundColor: color + "20",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ color, fontSize: 12, fontWeight: "600" }}>{label}</Text>
    </View>
  );
}
