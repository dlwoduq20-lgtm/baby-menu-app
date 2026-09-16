import { BottomNav } from "@/components/BottomNav";
import { ExitConfirmGuard } from "@/components/ExitConfirmGuard";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-16">
      <ExitConfirmGuard />
      {children}
      <BottomNav />
    </div>
  );
}

