import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts($filters: ProductFilterInput) {
    getProducts(filters: $filters) {
      products {
        id
        photo
        name
        suppliers
        stock
        price
        category
      }
      categories
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      photo
      suppliers
      stock
      price
      category
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      photo
      suppliers
      stock
      price
      category
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id)
  }
`;
