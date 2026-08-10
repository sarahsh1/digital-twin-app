import { StyleSheet } from "react-native";
import Svg, { Defs, Path, Pattern, Rect } from "react-native-svg";
import { useColors } from "@/hooks/use-colors";

interface HudGridProps {
  size?: number;
}

/** Faint blueprint grid used behind HUD-style panels (SVG so it renders on native, not just web). */
export function HudGrid({ size = 22 }: HudGridProps) {
  const colors = useColors();

  return (
    <Svg style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]} width="100%" height="100%">
      <Defs>
        <Pattern id="hud-grid" width={size} height={size} patternUnits="userSpaceOnUse">
          <Path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke={colors.primary}
            strokeOpacity={0.12}
            strokeWidth={1}
          />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#hud-grid)" />
    </Svg>
  );
}
