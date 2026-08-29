import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import ThemeProvider from "@/components/customsUi/ThemeProvider";
import { Toaster } from "sonner";
import "./globals.css";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskBoard",
  description: "A fast, minimal dashboard for your team's tasks and projects.",
};

const noFlashThemeScript = `(function(){try{var t=localStorage.getItem("dashboard-theme")||"system";var d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${robotoMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: noFlashThemeScript }} />
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster
          richColors
          closeButton
          position="bottom-right"
          offset={16}
          gap={10}
          toastOptions={{
            duration: 4000,
            style: { fontWeight: 500 },
          }}
        />
      </body>
    </html>
  );
}
