
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const RevenueCard = () => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));

  const { data: totalRevenue, isLoading } = useQuery({
    queryKey: ["monthly-revenue", selectedMonth],
    queryFn: async () => {
      const startOfMonth = new Date(selectedMonth + "-01");
      const year = startOfMonth.getFullYear();
      const month = startOfMonth.getMonth() + 1;

      const { data, error } = await supabase
        .from("rentals")
        .select("monthly_price")
        .eq("status", "Ativo")
        .gte("start_date", `${year}-${String(month).padStart(2, "0")}-01`)
        .lte("end_date", `${year}-${String(month).padStart(2, "0")}-31`);

      if (error) throw error;

      const total = data?.reduce((acc, rental) => acc + Number(rental.monthly_price), 0) || 0;
      return total;
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total a Receber
        </CardTitle>
        <div className="flex items-center gap-4">
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
          <CreditCard className="w-4 h-4 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading
            ? "Carregando..."
            : `R$ ${totalRevenue?.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Total de aluguéis ativos no período
        </p>
      </CardContent>
    </Card>
  );
};
