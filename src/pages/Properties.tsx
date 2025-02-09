
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PropertyForm, PropertyFormValues } from "@/components/property-form";
import { useState } from "react";

interface Property {
  id: number;
  title: string;
  address: string;
  status: string;
  price: string;
}

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: 1,
      title: "Apartamento Centro",
      address: "Rua Principal, 123",
      status: "Alugado",
      price: "R$ 2.500",
    },
    {
      id: 2,
      title: "Casa Jardim América",
      address: "Av. das Flores, 456",
      status: "Disponível",
      price: "R$ 3.200",
    },
    {
      id: 3,
      title: "Sala Comercial",
      address: "Av. Comercial, 789",
      status: "Alugado",
      price: "R$ 1.800",
    },
  ]);

  const [open, setOpen] = useState(false);

  const handleSubmit = (values: PropertyFormValues) => {
    const newProperty: Property = {
      id: properties.length + 1,
      ...values,
      status: "Disponível",
    };

    setProperties([...properties, newProperty]);
    setOpen(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-8 animate-fade-in">
          <SidebarTrigger />
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Propriedades</h1>
              <p className="text-muted-foreground mt-2">
                Gerencie suas propriedades
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Propriedade
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Propriedade</DialogTitle>
                </DialogHeader>
                <PropertyForm onSubmit={handleSubmit} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <Card key={property.id} className="animated-card cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl">{property.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {property.address}
                    </p>
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          property.status === "Alugado"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {property.status}
                      </span>
                      <span className="font-semibold">{property.price}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Properties;
