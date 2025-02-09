
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
  title: z.string().min(1, "O título é obrigatório"),
  address: z.string().min(1, "O endereço é obrigatório"),
  price: z.string().min(1, "O preço é obrigatório"),
});

export type PropertyFormValues = z.infer<typeof formSchema>;

interface PropertyFormProps {
  onSubmit: (values: PropertyFormValues) => void;
}

export function PropertyForm({ onSubmit }: PropertyFormProps) {
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      address: "",
      price: "",
    },
  });

  const handleSubmit = (values: PropertyFormValues) => {
    onSubmit(values);
    form.reset();
    toast.success("Propriedade cadastrada com sucesso!");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Apartamento Centro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Rua Principal, 123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço</FormLabel>
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
