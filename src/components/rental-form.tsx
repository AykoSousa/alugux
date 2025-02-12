
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Property } from "@/types/rental";

const formSchema = z.object({
  property_id: z.string().min(1, "A propriedade é obrigatória"),
  tenantName: z.string().min(1, "O nome do inquilino é obrigatório"),
  tenantCpf: z
    .string()
    .min(11, "CPF inválido")
    .max(11, "CPF inválido")
    .regex(/^\d+$/, "CPF deve conter apenas números"),
  startDate: z.string().min(1, "A data inicial é obrigatória"),
  endDate: z.string().min(1, "A data final é obrigatória"),
  monthlyPrice: z.string().min(1, "O valor mensal é obrigatório"),
  contractFile: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true;
      return file.size <= 5 * 1024 * 1024;
    }, "O arquivo deve ter no máximo 5MB"),
});

export type RentalFormValues = z.infer<typeof formSchema>;

interface RentalFormProps {
  onSubmit: (values: RentalFormValues) => void;
  availableProperties: Property[];
  defaultValues?: RentalFormValues;
}

export function RentalForm({ onSubmit, availableProperties, defaultValues }: RentalFormProps) {
  const form = useForm<RentalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      property_id: "",
      tenantName: "",
      tenantCpf: "",
      startDate: "",
      endDate: "",
      monthlyPrice: "",
    },
  });

  const handleSubmit = (values: RentalFormValues) => {
    onSubmit(values);
    if (!defaultValues) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="property_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Propriedade</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma propriedade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableProperties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          name="tenantCpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF do Inquilino</FormLabel>
              <FormControl>
                <Input placeholder="12345678900" maxLength={11} {...field} />
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

        <FormField
          control={form.control}
          name="contractFile"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Contrato Assinado</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file);
                    }
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {defaultValues ? "Atualizar" : "Cadastrar"}
        </Button>
      </form>
    </Form>
  );
}
