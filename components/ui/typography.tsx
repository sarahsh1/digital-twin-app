import { Text, type TextProps } from "react-native";
import { cn } from "@/lib/utils";

// A single 5-step type scale used across the app instead of picking a
// text-lg/text-2xl/etc size ad hoc per screen. Each role maps to one job:
// ScreenTitle (top of a tab/screen), SectionHeader (a grouped block within
// a screen), CardTitle (the heading inside a card/row), BodyText, Caption.

export function ScreenTitle({ className, ...props }: TextProps) {
  return <Text className={cn("text-foreground text-2xl font-bold", className)} {...props} />;
}

export function SectionHeader({ className, ...props }: TextProps) {
  return <Text className={cn("text-foreground text-lg font-bold", className)} {...props} />;
}

export function CardTitle({ className, ...props }: TextProps) {
  return <Text className={cn("text-foreground text-base font-semibold", className)} {...props} />;
}

export function BodyText({ className, ...props }: TextProps) {
  return <Text className={cn("text-foreground text-sm", className)} {...props} />;
}

export function Caption({ className, ...props }: TextProps) {
  return <Text className={cn("text-muted text-xs", className)} {...props} />;
}
