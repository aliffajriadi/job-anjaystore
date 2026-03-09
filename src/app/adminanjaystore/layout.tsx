export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin pages have their own full-screen design, no shared Navbar/Footer
  return <>{children}</>;
}
