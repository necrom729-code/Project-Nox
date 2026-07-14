import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { BackupProvider } from "@/lib/backup/BackupProvider";
export const metadata: Metadata = {
  title: "NECROM — Resurrect your files",
  description:
    "Cross-platform cloud backup with a cute chibi ghost. Documents, photos, videos and audio — always bring them back.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 antialiased">
        <I18nProvider>
          <AuthProvider>
            <BackupProvider>{children}</BackupProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
