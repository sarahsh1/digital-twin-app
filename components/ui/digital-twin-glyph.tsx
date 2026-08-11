import { useEffect } from "react";
import { View } from "react-native";
import Svg, { Circle, Line, Defs, LinearGradient, Stop } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useColors } from "@/hooks/use-colors";

const VIEWBOX = 300;
const CENTER = VIEWBOX / 2;

const nodes: { x: number; y: number; icon: keyof typeof Ionicons.glyphMap }[] = [
  { x: 68, y: 68, icon: "flash" }, // energy
  { x: 232, y: 68, icon: "analytics" }, // AI forecasting
  { x: 68, y: 232, icon: "link" }, // blockchain
  { x: 232, y: 232, icon: "cloud" }, // carbon
];

/**
 * Original hero graphic for onboarding: a glowing central "digital twin"
 * hub connected to the four data points EcoTwin actually tracks (energy,
 * forecasting, blockchain, carbon). Translates the reference site's
 * "glowing technical schematic on dark ground" language into something
 * abstract and on-brand, rather than reusing its literal infrastructure
 * illustration.
 */
export function DigitalTwinGlyph({ size = 260 }: { size?: number }) {
  const colors = useColors();
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 0.35 - pulse.value * 0.22,
    transform: [{ scale: 1 + pulse.value * 0.18 }],
  }));

  const scale = size / VIEWBOX;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {/* Breathing glow ring behind the hub */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: size * 0.42,
            height: size * 0.42,
            borderRadius: (size * 0.42) / 2,
            backgroundColor: colors.primary,
          },
          pulseStyle,
        ]}
      />

      <Svg width={size} height={size} viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}>
        <Defs>
          <LinearGradient id="hub" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.primary} />
            <Stop offset="1" stopColor={colors.secondary} />
          </LinearGradient>
        </Defs>

        {nodes.map((n, i) => (
          <Line
            key={`line-${i}`}
            x1={CENTER}
            y1={CENTER}
            x2={n.x}
            y2={n.y}
            stroke={colors.primary}
            strokeOpacity={0.45}
            strokeWidth={1.5}
          />
        ))}

        {nodes.map((n, i) => (
          <Circle key={`node-${i}`} cx={n.x} cy={n.y} r={22} fill="#05100D" stroke={colors.secondary} strokeWidth={1.5} />
        ))}

        <Circle cx={CENTER} cy={CENTER} r={40} fill="url(#hub)" />
      </Svg>

      {/* Icon overlays -- positioned from the same 0..VIEWBOX coordinate
          space as the SVG, scaled to the rendered size. */}
      <View style={{ position: "absolute", left: CENTER * scale - 15, top: CENTER * scale - 15 }}>
        <Ionicons name="business" size={30} color="#fff" />
      </View>
      {nodes.map((n, i) => (
        <View key={`icon-${i}`} style={{ position: "absolute", left: n.x * scale - 10, top: n.y * scale - 10 }}>
          <Ionicons name={n.icon} size={20} color={colors.secondary} />
        </View>
      ))}
    </View>
  );
}
