import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "./providers";


export const metadata: Metadata = {
  title: "Slapdash",
  description: "Realtime collaborative drawing app",
  icons: {
    icon: [
      {
        url: "/excalidraw-lbtjv7j78i9h62q36986vh.webp",
        type: "image/webp",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light' || theme === 'dark') {
                    document.documentElement.classList.add(theme);
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="font-satoshi bg-white dark:bg-black transition-colors duration-300"
      >
          <Toaster theme="dark" richColors />

        <Providers>
        
        {children}
        </Providers>

      </body>
    </html>
  );
}
