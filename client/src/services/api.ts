import axios from "axios";
import { API_CONFIG } from "../config/api.config";

// Dashboard API interfaces
export interface DashboardStats {
  totalProducts: number;
  totalSuppliers: number;
  totalCustomers: number;
}

export interface Customer {
  id: number;
  photo: string;
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
  email?: string;
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

// GraphQL API
export const getDashboardDataGQL = async (): Promise<DashboardData> => {
  const query = `
    query GetDashboard {
      dashboard {
        stats {
          totalProducts
          totalSuppliers
          totalCustomers
        }
        recentCustomers {
          id
          photo
          name
          email
          spent
          phone
          address
          registerDate
          country
        }
        transactions {
          id
          name
          email
          amount
          type
        }
      }
    }
  `;

  const response = await axios.post<{ data: { dashboard: DashboardData } }>(
    API_CONFIG.url,
    { query },
    {
      headers: {
        "Content-Type": "application/json",
        "Apollo-Require-Preflight": "true",
      },
    }
  );

  return response.data.data.dashboard;
};

export const getCustomerDetailsGQL = async (
  customerId: number
): Promise<CustomerDetails> => {
  const query = `
    query GetCustomerDetails($customerId: Int!) {
      customerDetails(customerId: $customerId) {
        id
        photo
        name
        email
        spent
        phone
        address
        registerDate
        country
        transactions {
          id
          name
          amount
          type
          email
          customerId
          createdAt
        }
      }
    }
  `;

  const variables = { customerId };

  const response = await axios.post<{
    data: { customerDetails: CustomerDetails };
  }>(
    API_CONFIG.url,
    { query, variables },
    {
      headers: {
        "Content-Type": "application/json",
        "Apollo-Require-Preflight": "true",
      },
    }
  );

  return response.data.data.customerDetails;
};
