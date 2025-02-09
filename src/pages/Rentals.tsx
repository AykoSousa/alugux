
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { RentalForm, RentalFormValues } from "@/components/rental-form";
import { toast } from "sonner";

interface Rental {
  id: number;
  propertyTitle: string;
  tenantName: string;
  tenantCpf: string;
  startDate: string;
  endDate: string;
  status: string;
  monthlyPrice: string;
  contractFile?: File;
}

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

  // Simulated available properties (in a real app, this would come from your properties database)
  const availableProperties = [
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
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Aluguel
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Aluguel</DialogTitle>
                </DialogHeader>
                <RentalForm
                  onSubmit={handleSubmit}
                  availableProperties={availableProperties}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rentals.map((rental) => (
              <Card
                key={rental.id}
                className="animated-card cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleRentalClick(rental)}
              >
                <CardHeader>
                  <CardTitle className="text-xl">{rental.propertyTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Inquilino: {rental.tenantName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      CPF: {rental.tenantCpf}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Período: {rental.startDate} até {rental.endDate}
                    </p>
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          rental.status === "Ativo"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {rental.status}
                      </span>
                      <span className="font-semibold">{rental.monthlyPrice}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Aluguel</DialogTitle>
              </DialogHeader>
              {selectedRental && (
                <RentalForm
                  onSubmit={handleEdit}
                  availableProperties={availableProperties}
                  defaultValues={{
                    propertyTitle: selectedRental.propertyTitle,
                    tenantName: selectedRental.tenantName,
                    tenantCpf: selectedRental.tenantCpf,
                    startDate: selectedRental.startDate,
                    endDate: selectedRental.endDate,
                    monthlyPrice: selectedRental.monthlyPrice,
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Rentals;
