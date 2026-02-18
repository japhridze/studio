
// This is a dummy layout to contain the deprecated admin pages.
// The real admin layout is in /app/[lang]/admin/layout.tsx
export default function DeprecatedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
