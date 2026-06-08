import type { Metadata } from \"next\";
import { Inter } from \"next/font/google\";
import \"./globals.css\";
import { AuthProvider } from \"@/components/AuthProvider\";

const inter = Inter({ 
  subsets: [\"latin\"],
  variable: \"--font-inter\",
  display: 'swap',
});

export const metadata: Metadata = {
  title: \"OperatorAI | Your First AI Employee\",
  description: \"Hire specialized AI employees to answer phones, book jobs, and manage your office in under 10 minutes.\",
  keywords: [\"AI\", \"service business\", \"automation\", \"receptionist\", \"dispatch\", \"HVAC AI\", \"Plumbing AI\"],
  authors: [{ name: \"TradeOS AI Team\" }],
  openGraph: {
    title: \"OperatorAI | Your First AI Employee\",
    description: \"Stop missing calls and drowning in paperwork. Hire AI agents that manage your office.\",
    url: \"https://operatorai.com\",
    siteName: \"OperatorAI\",
    images: [
      {
        url: \"/og-image.png\",
        width: 1200,
        height: 630,
        alt: \"OperatorAI Dashboard\",
      },
    ],
    locale: \"en_US\",
    type: \"website\",
  },
  twitter: {
    card: \"summary_large_image\",
    title: \"OperatorAI | Your First AI Employee\",
    description: \"Hired in 10 minutes. AI Receptionists, Dispatchers, and Office Managers.\",
    images: [\"/og-image.png\"],
  },
  icons: {
    icon: \"/favicon.ico\",
    shortcut: \"/favicon.ico\",
    apple: \"/apple-touch-icon.png\",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang=\"en\" className={`${inter.variable} scroll-smooth`}>
      <body className=\"font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900\">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
