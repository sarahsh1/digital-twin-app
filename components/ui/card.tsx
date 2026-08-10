import { View, Text, type DimensionValue, type ViewProps } from 'react-native'
import { useColors } from '@/hooks/use-colors'
import { cn } from '@/lib/utils'

/**
 * Elevated content card -- the shared "bg-surface + border" surface used
 * for grouped detail (settings groups, form sections, chart containers).
 */
export function Card({ className, style, ...props }: ViewProps) {
  const colors = useColors()
  return (
    <View
      className={cn('bg-surface rounded-2xl p-4', className)}
      style={[{ borderWidth: 1, borderColor: colors.border }, style]}
      {...props}
    />
  )
}

type MetricTone =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'

interface MetricCardProps {
  label: string
  value: string
  caption?: string
  tone?: MetricTone
  width?: DimensionValue
  className?: string
}

/**
 * A single number that matters, with its label and an optional caption --
 * for stat strips and key-result rows. Distinct from Card so a KPI reads
 * with more weight than a plain grouped-content surface.
 *
 * Styled as a HUD telemetry readout: mono uppercase label, glowing tabular
 * value, and a left accent bar in the tone color.
 */
export function MetricCard({
  label,
  value,
  caption,
  tone = 'default',
  width,
  className
}: MetricCardProps) {
  const colors = useColors()
  const toneColor: Record<MetricTone, string> = {
    default: colors.foreground,
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error
  }
  const accent = toneColor[tone]

  return (
    <View
      className={cn('bg-surface rounded-2xl p-4 overflow-hidden', className)}
      style={{ borderWidth: 1, borderColor: colors.border, width }}
    >
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 2,
          backgroundColor: accent
        }}
      />
      <Text
        className="font-mono text-[10px] uppercase tracking-widest text-muted"
        numberOfLines={1}
      >
        {label}
      </Text>
      <Text
        style={{
          color: accent,
          textShadowColor: accent,
          textShadowRadius: 12,
          textShadowOffset: { width: 0, height: 0 },
          fontVariant: ['tabular-nums']
        }}
        className="font-mono text-2xl font-bold mt-1"
      >
        {value}
      </Text>
      {caption ? (
        <Text className="text-muted text-xs mt-1">{caption}</Text>
      ) : null}
    </View>
  )
}
