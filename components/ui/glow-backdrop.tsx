import { View, type ViewProps } from "react-native";
import { useColors } from "@/hooks/use-colors";

/**
 * Ambient light wrapper for the onboarding "hero" moments -- two soft,
 * low-opacity color blobs floating behind the content on a deep near-black
 * ground. Cheap stand-in for the radial glow that carries most of a premium
 * dark hero's visual weight, without needing blur support.
 *
 * Deliberately deeper than the app's standard `colors.background`: this is
 * a special hero treatment for first-run onboarding, not the everyday
 * in-app surface color.
 */
export function GlowBackdrop({ children, style, ...props }: ViewProps) {
  const colors = useColors();
  return (
    <View style={[{ flex: 1, backgroundColor: "#05100D", overflow: "hidden" }, style]} {...props}>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: -140,
          right: -110,
          width: 340,
          height: 340,
          borderRadius: 170,
          backgroundColor: colors.primary,
          opacity: 0.16,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: -160,
          left: -130,
          width: 380,
          height: 380,
          borderRadius: 190,
          backgroundColor: colors.secondary,
          opacity: 0.12,
        }}
      />
      {children}
    </View>
  );
}
