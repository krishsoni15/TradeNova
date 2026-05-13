/**
 * Auth layout
 * Centered layout with gradient mesh background for login pages
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background gradient mesh */}
      <div className="gradient-mesh absolute inset-0" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 20l20-20h1.41L0 21.41V20zM22.41 0L0 22.41V20L20 0h2.41z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">{children}</div>
    </div>
  );
}
