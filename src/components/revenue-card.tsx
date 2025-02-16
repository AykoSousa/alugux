
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RevenueCardProps {
  selectedMonth: string;
}

export const RevenueCard = ({ selectedMonth }: RevenueCardProps) => {
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total a Receber
        </CardTitle>
        <CreditCard className="w-4 h-4 text-gray-500" />
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
