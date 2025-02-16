
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Key, Users, CalendarIcon } from "lucide-react";
import { RevenueCard } from "@/components/revenue-card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));

  const { data: properties, isLoading: isLoadingProperties } = useQuery({
    queryKey: ["properties-count", selectedMonth],
    queryFn: async () => {
      const startOfMonth = new Date(selectedMonth + "-01");
      const year = startOfMonth.getFullYear();
      const month = startOfMonth.getMonth() + 1;

      const { count, error } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .lte("created_at", `${year}-${String(month).padStart(2, "0")}-31`);

      if (error) throw error;
      return count || 0;
    },
  });

  const { data: activeRentals, isLoading: isLoadingRentals } = useQuery({
    queryKey: ["active-rentals-count", selectedMonth],
    queryFn: async () => {
      const startOfMonth = new Date(selectedMonth + "-01");
      const year = startOfMonth.getFullYear();
      const month = startOfMonth.getMonth() + 1;

      const { count, error } = await supabase
        .from("rentals")
        .select("*", { count: "exact", head: true })
        .eq("status", "Ativo")
        .lte("start_date", `${year}-${String(month).padStart(2, "0")}-31`);

      if (error) throw error;
      return count || 0;
    },
  });

  const { data: tenants, isLoading: isLoadingTenants } = useQuery({
    queryKey: ["tenants-count", selectedMonth],
    queryFn: async () => {
      const startOfMonth = new Date(selectedMonth + "-01");
      const year = startOfMonth.getFullYear();
      const month = startOfMonth.getMonth() + 1;

      const { data, error } = await supabase
        .from("rentals")
        .select("tenant_cpf")
        .eq("status", "Ativo")
        .lte("start_date", `${year}-${String(month).padStart(2, "0")}-31`);

      if (error) throw error;
      const uniqueTenants = new Set(data.map(rental => rental.tenant_cpf));
      return uniqueTenants.size;
    },
  });

  // Gera os últimos 12 meses para o select
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      value: format(date, "yyyy-MM"),
      label: format(date, "MMMM yyyy", { locale: ptBR }),
    };
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

          <div className="flex items-center gap-2 mb-6">
            <CalendarIcon className="h-5 w-5 text-gray-500" />
            <Select
              value={selectedMonth}
              onValueChange={(value) => setSelectedMonth(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <RevenueCard selectedMonth={selectedMonth} />
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
