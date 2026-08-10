import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { useColors } from "@/hooks/use-colors";

interface LoadingIndicatorProps {
  label?: string;
}

/** Continuously-rotating teal arc, matching the HUD design system, for full-screen loading states. */
export function LoadingIndicator({ label }: LoadingIndicatorProps) {
  const colors = useColors();
  const size = 64;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.72;

  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 900, easing: Easing.linear }),
      -1
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className="items-center justify-center">
      <Animated.View style={[{ width: size, height: size }, animatedStyle]}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.primary}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference - arcLength}`}
            strokeLinecap="round"
            fill="transparent"
          />
        </Svg>
      </Animated.View>
      {label && (
        <Text
          className="font-mono text-[10px] uppercase tracking-widest text-muted"
          style={{ marginTop: 16 }}
        >
          {label}
        </Text>
      )}
    </View>
  );
}
