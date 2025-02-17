
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rental } from "@/types/rental";

interface RentalCardProps {
  rental: Rental;
  onClick: (rental: Rental) => void;
}

export const RentalCard = ({ rental, onClick }: RentalCardProps) => {
  return (
    <Card
      className="animated-card cursor-pointer"
      onClick={() => onClick(rental)}
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
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
              }`}
            >
              {rental.status}
            </span>
            <span className="font-semibold">{rental.monthlyPrice}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
