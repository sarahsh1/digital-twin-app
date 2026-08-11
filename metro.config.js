const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

// Detect if we are running in a CI/Production environment (like Vercel)
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL

module.exports = withNativeWind(config, {
  input: './global.css',
  // Only force write in development to avoid Vercel build errors
  forceWriteFileSystem: !isProduction
})
