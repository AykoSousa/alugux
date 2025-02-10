
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RentalDialog } from "@/components/rental-dialog";
import { RentalCard } from "@/components/rental-card";
import { Property, Rental, RentalFormValues } from "@/types/rental";

const Rentals = () => {
  const [rentals, setRentals] = useState<Rental[]>([
    {
      id: 1,
      propertyTitle: "Apartamento Centro",
      tenantName: "João Silva",
      tenantCpf: "12345678900",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "Ativo",
      monthlyPrice: "R$ 2.500",
    },
    {
      id: 2,
      propertyTitle: "Casa Jardim América",
      tenantName: "Maria Santos",
      tenantCpf: "98765432100",
      startDate: "2024-02-01",
      endDate: "2025-01-31",
      status: "Ativo",
      monthlyPrice: "R$ 3.200",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);

  const availableProperties: Property[] = [
    { id: 1, title: "Apartamento Centro" },
    { id: 2, title: "Casa Jardim América" },
    { id: 3, title: "Sala Comercial Downtown" },
    { id: 4, title: "Cobertura Beira Mar" },
  ];

  const handleSubmit = (values: RentalFormValues) => {
    const newRental: Rental = {
      id: rentals.length + 1,
      propertyTitle: values.propertyTitle,
      tenantName: values.tenantName,
      tenantCpf: values.tenantCpf,
      startDate: values.startDate,
      endDate: values.endDate,
      monthlyPrice: values.monthlyPrice,
      status: "Ativo",
      contractFile: values.contractFile,
    };

    setRentals([...rentals, newRental]);
    setOpen(false);
    toast.success("Aluguel cadastrado com sucesso!");
  };

  const handleEdit = (values: RentalFormValues) => {
    if (!selectedRental) return;

    const updatedRentals = rentals.map((rental) =>
      rental.id === selectedRental.id
        ? {
            ...rental,
            propertyTitle: values.propertyTitle,
            tenantName: values.tenantName,
            tenantCpf: values.tenantCpf,
            startDate: values.startDate,
            endDate: values.endDate,
            monthlyPrice: values.monthlyPrice,
            contractFile: values.contractFile,
          }
        : rental
    );

    setRentals(updatedRentals);
    setEditOpen(false);
    setSelectedRental(null);
    toast.success("Aluguel atualizado com sucesso!");
  };

  const handleRentalClick = (rental: Rental) => {
    setSelectedRental(rental);
    setEditOpen(true);
  };

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
            availableProperties={availableProperties}
          />

          <RentalDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            onSubmit={handleEdit}
            title="Editar Aluguel"
            availableProperties={availableProperties}
            defaultValues={selectedRental || undefined}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Rentals;
