
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppearanceSettings } from "@/components/settings/appearance-settings";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { SecuritySettings } from "@/components/settings/security-settings";

const Settings = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-8 animate-fade-in">
          <SidebarTrigger />
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Configurações</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie suas preferências e informações pessoais
            </p>
          </div>

          <div className="grid gap-6">
            <AppearanceSettings />
            <ProfileSettings />
            <SecuritySettings />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
