
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  propertyTitle: z.string().min(1, "O título da propriedade é obrigatório"),
  tenantName: z.string().min(1, "O nome do inquilino é obrigatório"),
  startDate: z.string().min(1, "A data inicial é obrigatória"),
  endDate: z.string().min(1, "A data final é obrigatória"),
  monthlyPrice: z.string().min(1, "O valor mensal é obrigatório"),
});

export type RentalFormValues = z.infer<typeof formSchema>;

interface RentalFormProps {
  onSubmit: (values: RentalFormValues) => void;
}

export function RentalForm({ onSubmit }: RentalFormProps) {
  const form = useForm<RentalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyTitle: "",
      tenantName: "",
      startDate: "",
      endDate: "",
      monthlyPrice: "",
    },
  });

  const handleSubmit = (values: RentalFormValues) => {
    onSubmit(values);
    form.reset();
    toast.success("Aluguel cadastrado com sucesso!");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="propertyTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título da Propriedade</FormLabel>
              <FormControl>
                <Input placeholder="Apartamento Centro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tenantName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Inquilino</FormLabel>
              <FormControl>
                <Input placeholder="João Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Inicial</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Final</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="monthlyPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Mensal</FormLabel>
              <FormControl>
                <Input placeholder="R$ 2.500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Cadastrar
        </Button>
      </form>
    </Form>
  );
}
