import { ScrollViewStyleReset } from "expo-router/html";

// This app has no light theme (see lib/theme-provider.tsx -- colorScheme is
// forced to "dark" and never changes). The default Expo Router HTML shell
// sets no background/color-scheme at all, so before JS hydrates -- or on a
// slow connection where JS takes a while to load -- the raw page is the
// browser's default white. Baking the dark colors into the static shell
// itself removes that window entirely, and `color-scheme: dark` stops
// native browser chrome (scrollbars, autofill, selection) from following
// the OS's light/dark setting.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="color-scheme" content="dark" />
        <ScrollViewStyleReset />
        <style
          id="ecotwin-forced-dark"
          dangerouslySetInnerHTML={{
            __html: `
              html, body, #root { background-color: #131314; }
              body { color: #FFFFFF; }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
