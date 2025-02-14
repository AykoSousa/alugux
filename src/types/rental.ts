
export interface Rental {
  id: string;
  property_id: string;
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
  property_id: string;
  tenantName: string;
  tenantCpf: string;
  startDate: string;
  endDate: string;
  monthlyPrice: string;
  contractFile?: File;
}

export interface Property {
  id: string;
  title: string;
}
