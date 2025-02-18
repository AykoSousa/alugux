
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
import { PropertyForm, PropertyFormValues } from "@/components/property-form";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Property {
  id: string;
  title: string;
  address: string;
  status: string;
  price: string;
}

const Properties = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        navigate("/auth");
        return [];
      }

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Erro ao carregar propriedades");
        throw error;
      }

      return data.map((property) => ({
        ...property,
        price: `R$ ${Number(property.price).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      }));
    },
  });

  const handleSubmit = async (values: PropertyFormValues) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        navigate("/auth");
        return;
      }

      const priceAsNumber = Number(values.price.replace(/[^0-9.-]+/g, ""));
      
      const { error } = await supabase.from("properties").insert({
        title: values.title,
        address: values.address,
        price: priceAsNumber,
        status: "Disponível",
        user_id: session.session.user.id
      });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["properties"] });
      setOpen(false);
      toast.success("Propriedade cadastrada com sucesso!");
    } catch (error) {
      console.error("Error creating property:", error);
      toast.error("Erro ao cadastrar propriedade");
    }
  };

  const handleEdit = async (values: PropertyFormValues) => {
    if (!selectedProperty) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        navigate("/auth");
        return;
      }

      const priceAsNumber = Number(values.price.replace(/[^0-9.-]+/g, ""));
      
      const { error } = await supabase
        .from("properties")
        .update({
          title: values.title,
          address: values.address,
          price: priceAsNumber,
        })
        .eq("id", selectedProperty.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["properties"] });
      setEditOpen(false);
      setSelectedProperty(null);
      toast.success("Propriedade atualizada com sucesso!");
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Erro ao atualizar propriedade");
    }
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setEditOpen(true);
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
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
      <div className="min-h-screen flex w-full bg-background">
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
              <DialogContent className="glass-panel">
                <DialogHeader>
                  <DialogTitle>Nova Propriedade</DialogTitle>
                </DialogHeader>
                <PropertyForm onSubmit={handleSubmit} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <Card
                key={property.id}
                className="animated-card cursor-pointer"
                onClick={() => handlePropertyClick(property)}
              >
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
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
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

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="glass-panel">
              <DialogHeader>
                <DialogTitle>Editar Propriedade</DialogTitle>
              </DialogHeader>
              {selectedProperty && (
                <PropertyForm
                  key={selectedProperty.id}
                  onSubmit={handleEdit}
                  initialValues={{
                    title: selectedProperty.title,
                    address: selectedProperty.address,
                    price: selectedProperty.price,
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

export default Properties;
