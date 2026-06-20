import "./globals.css";

export const metadata = {
  title: "Rootly — The AI Company Brain for Engineering Teams",
  description:
    "Real-time reasoning across Jira, GitHub, Slack, meetings, and code. Every answer comes with proof. Built for teams that ship at speed.",
  keywords: [
    "AI",
    "engineering intelligence",
    "developer productivity",
    "Jira",
    "GitHub",
    "Slack integration",
    "engineering copilot",
  ],
  openGraph: {
    title: "Rootly — The AI Company Brain for Engineering Teams",
    description:
      "Real-time reasoning across Jira, GitHub, Slack, meetings, and code. Every answer comes with proof.",
    type: "website",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
