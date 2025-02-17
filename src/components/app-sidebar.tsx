
import { cn } from "@/lib/utils";
import { Building2, CreditCard, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar, SidebarClose } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function AppSidebar() {
  const location = useLocation();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
      active: location.pathname === "/",
    },
    {
      label: "Propriedades",
      icon: Building2,
      href: "/properties",
      active: location.pathname === "/properties",
    },
    {
      label: "Aluguéis",
      icon: CreditCard,
      href: "/rentals",
      active: location.pathname === "/rentals",
    },
    {
      label: "Configurações",
      icon: Settings,
      href: "/settings",
      active: location.pathname === "/settings",
    },
  ];

  return (
    <Sidebar className="border-r bg-card print:hidden">
      <div className="flex h-full flex-col gap-4">
        <div className="flex-1 flex flex-col gap-1 px-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                route.active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </div>
        <div className="p-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
      <SidebarClose />
    </Sidebar>
  );
}
