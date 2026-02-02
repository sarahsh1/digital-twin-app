import { View, type ViewProps } from "react-native";
import { BlurView } from "expo-blur";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { cn } from "@/lib/utils";

interface GlassCardProps extends ViewProps {
  intensity?: number;
  children: React.ReactNode;
}

/**
 * Glass morphism card component with blur effect
 * Creates a premium, modern UI appearance
 */
export function GlassCard({ intensity = 20, children, className, style, ...props }: GlassCardProps) {
  const colorScheme = useColorScheme();

  return (
    <View
      className={cn("rounded-2xl overflow-hidden", className)}
      style={[
        {
          backgroundColor: colorScheme === "dark" ? "rgba(30, 32, 34, 0.7)" : "rgba(255, 255, 255, 0.7)",
          borderWidth: 1,
          borderColor: colorScheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        style,
      ]}
      {...props}
    >
      <BlurView
        intensity={intensity}
        tint={colorScheme === "dark" ? "dark" : "light"}
        style={{ flex: 1 }}
      >
        {children}
      </BlurView>
    </View>
  );
}
