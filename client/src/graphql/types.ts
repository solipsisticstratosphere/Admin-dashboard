export interface DashboardStats {
  totalProducts: number;
  totalSuppliers: number;
  totalCustomers: number;
}

export interface Customer {
  id: number;
  photo: string | null;
  name: string;
  email: string;
  spent: string;
  phone: string;
  address: string;
  registerDate: string;
  country: string;
}

export interface Transaction {
  id: number;
  name: string;
  email: string | null;
  amount: string;
  type: string;
  customerId?: number;
  createdAt?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentCustomers: Customer[];
  transactions: Transaction[];
}

export interface CustomerDetails extends Customer {
  transactions: Transaction[];
}

export interface DashboardQueryResult {
  dashboard: DashboardData;
}

export interface CustomerDetailsQueryResult {
  customerDetails: CustomerDetails;
}
