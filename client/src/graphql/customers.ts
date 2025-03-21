import { gql } from "@apollo/client";

export const GET_CUSTOMERS = gql`
  query GetCustomers($filters: CustomerFiltersInput) {
    getCustomers(filters: $filters) {
      id
      photo
      name
      email
      spent
      phone
      address
      register_date
    }
  }
`;

export const GET_CUSTOMER = gql`
  query GetCustomer($id: String!) {
    getCustomer(id: $id) {
      id
      photo
      name
      email
      spent
      phone
      address
      register_date
    }
  }
`;
