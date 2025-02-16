
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Key, Users } from "lucide-react";
import { RevenueCard } from "@/components/revenue-card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { data: properties, isLoading: isLoadingProperties } = useQuery({
    queryKey: ["properties-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return count || 0;
    },
  });

  const { data: activeRentals, isLoading: isLoadingRentals } = useQuery({
    queryKey: ["active-rentals-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("rentals")
        .select("*", { count: "exact", head: true })
        .eq("status", "Ativo");

      if (error) throw error;
      return count || 0;
    },
  });

  const { data: tenants, isLoading: isLoadingTenants } = useQuery({
    queryKey: ["tenants-count"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rentals")
        .select("tenant_cpf")
        .eq("status", "Ativo");

      if (error) throw error;
      // Contando inquilinos únicos usando Set
      const uniqueTenants = new Set(data.map(rental => rental.tenant_cpf));
      return uniqueTenants.size;
    },
  });

  const stats = [
    {
      title: "Total de Propriedades",
      value: isLoadingProperties ? "..." : String(properties),
      icon: Building2,
      description: "Imóveis cadastrados",
    },
    {
      title: "Aluguéis Ativos",
      value: isLoadingRentals ? "..." : String(activeRentals),
      icon: Key,
      description: "Contratos em andamento",
    },
    {
      title: "Inquilinos",
      value: isLoadingTenants ? "..." : String(tenants),
      icon: Users,
      description: "Inquilinos ativos",
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-8 animate-fade-in">
          <SidebarTrigger />
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Bem-vindo ao seu painel de controle
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <RevenueCard />
            {stats.map((stat) => (
              <Card key={stat.title} className="animated-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="w-4 h-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
