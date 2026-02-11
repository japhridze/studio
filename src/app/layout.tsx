// This is a dummy root layout, the real layout is in app/[lang]/layout.tsx
// It's needed to prevent Next.js from throwing an error.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
