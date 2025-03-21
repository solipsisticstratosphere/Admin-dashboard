import { gql } from "@apollo/client";

export const GET_SUPPLIERS = gql`
  query GetSuppliers($filters: SupplierFilterInput) {
    getSuppliers(filters: $filters) {
      id
      name
      address
      company
      date
      amount
      status
    }
  }
`;

export const GET_SUPPLIER = gql`
  query GetSupplier($id: String!) {
    getSupplier(id: $id) {
      id
      name
      address
      company
      date
      amount
      status
    }
  }
`;

export const CREATE_SUPPLIER = gql`
  mutation CreateSupplier($input: CreateSupplierInput!) {
    createSupplier(input: $input) {
      id
      name
      address
      company
      date
      amount
      status
    }
  }
`;

export const UPDATE_SUPPLIER = gql`
  mutation UpdateSupplier($id: String!, $input: UpdateSupplierInput!) {
    updateSupplier(id: $id, input: $input) {
      id
      name
      address
      company
      date
      amount
      status
    }
  }
`;

export const DELETE_SUPPLIER = gql`
  mutation DeleteSupplier($id: String!) {
    deleteSupplier(id: $id)
  }
`;
