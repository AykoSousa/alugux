
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RentalForm } from "@/components/rental-form";
import { Property, Rental, RentalFormValues } from "@/types/rental";

interface RentalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: RentalFormValues) => void;
  title: string;
  defaultValues?: Partial<RentalFormValues>;
  availableProperties: Property[];
}

export const RentalDialog = ({
  open,
  onOpenChange,
  onSubmit,
  title,
  defaultValues,
  availableProperties,
}: RentalDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <RentalForm
          onSubmit={onSubmit}
          availableProperties={availableProperties}
          defaultValues={defaultValues}
        />
      </DialogContent>
    </Dialog>
  );
};
