/**
 * Dark values below come from .claude/design.md ("EcoTwin Sovereign").
 * That spec only defines a dark palette, so light-mode values are left at
 * their pre-existing values -- there's nothing to map them to yet.
 * @type {const}
 */
const themeColors = {
  // Core tokens the app already depends on everywhere.
  primary: { light: '#00C896', dark: '#2dd4bf' },
  background: { light: '#ffffff', dark: '#131314' }, // DESIGN.md `surface`
  surface: { light: '#f5f5f5', dark: '#212122' }, // DESIGN.md `surface-container`
  foreground: { light: '#11181C', dark: '#FFFFFF' }, // no on-surface token in DESIGN.md yet
  muted: { light: '#687076', dark: '#E0E0E0' }, // no muted/on-surface-variant token in DESIGN.md yet
  border: { light: '#E5E7EB', dark: '#8b938d' }, // DESIGN.md `outline`
  success: { light: '#00C896', dark: '#2dd4bf' }, // no distinct success token; mirrors primary as before
  warning: { light: '#FFA500', dark: '#FFA500' }, // no warning token in DESIGN.md yet
  error: { light: '#FF4444', dark: '#ffb4ab' },
  secondary: { light: '#007ACC', dark: '#baccbe' },

  // DESIGN.md tokens with no prior equivalent in this app. No light-mode
  // spec exists, so these use the same value in both schemes for now.
  onPrimary: { light: '#003730', dark: '#003730' },
  primaryContainer: { light: '#005047', dark: '#005047' },
  onPrimaryContainer: { light: '#4ff1db', dark: '#4ff1db' },
  onSecondary: { light: '#25342b', dark: '#25342b' },
  secondaryContainer: { light: '#3b4b41', dark: '#3b4b41' },
  onSecondaryContainer: { light: '#d6e8d9', dark: '#d6e8d9' },
  onError: { light: '#690005', dark: '#690005' },
  outline: { light: '#8b938d', dark: '#8b938d' },
  surfaceDim: { light: '#131314', dark: '#131314' },
  surfaceBright: { light: '#3a393a', dark: '#3a393a' },
  surfaceContainerLowest: { light: '#0e0e0f', dark: '#0e0e0f' },
  surfaceContainerLow: { light: '#1c1b1c', dark: '#1c1b1c' },
  surfaceContainer: { light: '#212122', dark: '#212122' },
  surfaceContainerHigh: { light: '#2b2a2b', dark: '#2b2a2b' },
  surfaceContainerHighest: { light: '#363436', dark: '#363436' },
};

module.exports = { themeColors };
