import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "基础投注系统",
  description: "Mini Project - 游戏投注与结算",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen bg-slate-50">
        <header className="bg-slate-800 text-white py-3 px-4">
          <a href="/" className="font-semibold">基础投注系统</a>
        </header>
        {children}
      </body>
    </html>
  );
}
