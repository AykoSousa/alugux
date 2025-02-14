
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RentalDialog } from "@/components/rental-dialog";
import { RentalCard } from "@/components/rental-card";
import { Property, Rental, RentalFormValues } from "@/types/rental";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Rentals = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);

  const { data: properties = [] } = useQuery({
    queryKey: ["available-properties"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        navigate("/auth");
        return [];
      }

      const { data, error } = await supabase
        .from("properties")
        .select("id, title")
        .eq("status", "Disponível");

      if (error) {
        toast.error("Erro ao carregar propriedades");
        throw error;
      }

      return data;
    },
  });

  const { data: rentals = [], isLoading } = useQuery({
    queryKey: ["rentals"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        navigate("/auth");
        return [];
      }

      const { data, error } = await supabase
        .from("rentals")
        .select(`
          *,
          property:properties(title)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Erro ao carregar aluguéis");
        throw error;
      }

      return data.map((rental) => ({
        id: rental.id,
        property_id: rental.property_id,
        propertyTitle: rental.property.title,
        tenantName: rental.tenant_name,
        tenantCpf: rental.tenant_cpf,
        startDate: rental.start_date,
        endDate: rental.end_date,
        status: rental.status,
        monthlyPrice: `R$ ${Number(rental.monthly_price).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      }));
    },
  });

  const handleSubmit = async (values: RentalFormValues) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        navigate("/auth");
        return;
      }

      const priceAsNumber = Number(values.monthlyPrice.replace(/[^0-9.-]+/g, ""));
      
      const { error } = await supabase.from("rentals").insert({
        property_id: values.property_id,
        tenant_name: values.tenantName,
        tenant_cpf: values.tenantCpf,
        start_date: values.startDate,
        end_date: values.endDate,
        monthly_price: priceAsNumber,
        status: "Ativo",
        user_id: session.session.user.id,
      });

      if (error) throw error;

      // Atualizar o status da propriedade para "Alugado"
      await supabase
        .from("properties")
        .update({ status: "Alugado" })
        .eq("id", values.property_id);

      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      queryClient.invalidateQueries({ queryKey: ["available-properties"] });
      setOpen(false);
      toast.success("Aluguel cadastrado com sucesso!");
    } catch (error) {
      console.error("Error creating rental:", error);
      toast.error("Erro ao cadastrar aluguel");
    }
  };

  const handleEdit = async (values: RentalFormValues) => {
    if (!selectedRental) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        navigate("/auth");
        return;
      }

      const priceAsNumber = Number(values.monthlyPrice.replace(/[^0-9.-]+/g, ""));
      
      const { error } = await supabase
        .from("rentals")
        .update({
          property_id: values.property_id,
          tenant_name: values.tenantName,
          tenant_cpf: values.tenantCpf,
          start_date: values.startDate,
          end_date: values.endDate,
          monthly_price: priceAsNumber,
        })
        .eq("id", selectedRental.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      setEditOpen(false);
      setSelectedRental(null);
      toast.success("Aluguel atualizado com sucesso!");
    } catch (error) {
      console.error("Error updating rental:", error);
      toast.error("Erro ao atualizar aluguel");
    }
  };

  const handleRentalClick = (rental: Rental) => {
    setSelectedRental(rental);
    setEditOpen(true);
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 p-8 animate-fade-in">
            <SidebarTrigger />
            <div>Carregando...</div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-8 animate-fade-in">
          <SidebarTrigger />
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Aluguéis</h1>
              <p className="text-muted-foreground mt-2">
                Gerencie seus contratos de aluguel
              </p>
            </div>
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Aluguel
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rentals.map((rental) => (
              <RentalCard
                key={rental.id}
                rental={rental}
                onClick={handleRentalClick}
              />
            ))}
          </div>

          <RentalDialog
            open={open}
            onOpenChange={setOpen}
            onSubmit={handleSubmit}
            title="Novo Aluguel"
            availableProperties={properties}
          />

          <RentalDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            onSubmit={handleEdit}
            title="Editar Aluguel"
            availableProperties={properties}
            defaultValues={
              selectedRental
                ? {
                    property_id: selectedRental.property_id,
                    tenantName: selectedRental.tenantName,
                    tenantCpf: selectedRental.tenantCpf,
                    startDate: selectedRental.startDate,
                    endDate: selectedRental.endDate,
                    monthlyPrice: selectedRental.monthlyPrice,
                  }
                : undefined
            }
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Rentals;
