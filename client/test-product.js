// This is a manual test script for product creation
// Run this with: node test-product.js

const fetch = require("node-fetch");

// Generate a unique product name using timestamp
const productName = `Test Product ${Date.now()}`;

// Create product data
const productData = {
  name: productName,
  photo: "https://via.placeholder.com/150",
  suppliers: "Test Supplier",
  stock: "100",
  price: "19.99",
  category: "Test Category",
};

// GraphQL mutation for creating a product
const createProductMutation = `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      suppliers
      stock
      price
      category
    }
  }
`;

// Execute the GraphQL mutation
async function testCreateProduct() {
  try {
    console.log("Attempting to create product:", productData);

    const response = await fetch("http://localhost:3001/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: createProductMutation,
        variables: {
          input: productData,
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL Error:", result.errors);
      return;
    }

    console.log("Product created successfully:", result.data.createProduct);
  } catch (error) {
    console.error("Error creating product:", error);
  }
}

// Run the test
testCreateProduct();
