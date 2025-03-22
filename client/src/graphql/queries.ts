import { gql } from "@apollo/client";

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
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

export const GET_CUSTOMER_DETAILS = gql`
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
        email
        amount
        type
      }
    }
  }
`;

export const GET_ORDERS = gql`
  query GetOrders($filters: OrderFilters) {
    orders(filters: $filters) {
      items {
        id
        photo
        name
        address
        products
        price
        status
        order_date
      }
      totalCount
    }
  }
`;
