export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-beige">
      <div className="border-b border-ink/10 bg-sand px-6 py-3 text-xs uppercase tracking-[0.18em] text-ink-soft md:px-10">
        Espace gestion — Parvana
      </div>
      {children}
    </div>
  );
}
