
export interface Rental {
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

export interface RentalFormValues {
  propertyTitle: string;
  tenantName: string;
  tenantCpf: string;
  startDate: string;
  endDate: string;
  monthlyPrice: string;
  contractFile?: File;
}

export interface Property {
  id: number;
  title: string;
}
