import { Inter } from "next/font/google";
import "./globals.css";
import { WebSocketProvider } from "@/services/WebSocketService";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chat-App",
  description: "Chat en vivo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <WebSocketProvider>
      <body className={inter.className}>{children}</body>
      </WebSocketProvider>
    </html>
  );
}
