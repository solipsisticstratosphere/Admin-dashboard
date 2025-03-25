export interface DashboardStats {
  totalProducts: number;
  totalSuppliers: number;
  totalCustomers: number;
}

export interface Customer {
  id: string;
  photo?: string;
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

export interface Order {
  id: number;
  photo: string | null;
  name: string;
  address: string;
  products: string;
  price: string;
  status: string;
  order_date: string;
}

export interface OrdersResponse {
  items: Order[];
  totalCount: number;
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

export interface OrdersQueryResult {
  orders: OrdersResponse;
}

export interface CustomerFilters {
  name?: string;
  email?: string;
  address?: string;
  register_date?: string;
  phone?: string;
  spent?: string;
}

export interface CustomersQueryResult {
  getCustomers: Customer[];
}

export interface CustomerQueryResult {
  getCustomer: Customer;
}

export interface OrderFilters {
  name?: string;
  address?: string;
  products?: string;
  status?: string;
  order_date?: string;
}
