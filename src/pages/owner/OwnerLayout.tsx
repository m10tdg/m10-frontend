import { Outlet, useNavigate } from "react-router-dom";

import { useLangStore } from "@/shared/stores/langStore";
import { useOwnerStore } from "@/shared/stores/owner-store";
import { ownerTranslations } from "@/shared/config/translations/owner";
import { bg } from "@/shared/styles/colors";
import { OwnerHeader } from "@/pages/owner/components/OwnerHeader";
import { OwnerSidebar } from "@/pages/owner/components/OwnerSidebar";

// Shell of the owner console: header on top, sidebar navigation, page content.
export function OwnerLayout() {
  const { lang } = useLangStore();
  const tx = ownerTranslations[lang];
  const navigate = useNavigate();
  const owner = useOwnerStore((state) => state.owner);
  const logout = useOwnerStore((state) => state.logout);

  const handleSignOut = () => {
    logout();
    navigate("/owner/login", { replace: true });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: bg, fontFamily: "Inter, sans-serif" }}>
      <OwnerHeader
        owner={owner}
        badge={tx.badge}
        signOutLabel={tx.nav.signOut}
        onSignOut={handleSignOut}
      />
      <div className="flex flex-col lg:flex-row">
        <OwnerSidebar tx={tx.nav} />
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
