// src/apollo.ts
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { API_CONFIG } from "./config/api.config";

// Determine whether to use absolute or relative URL based on environment
const uri = API_CONFIG.isProduction
  ? "/graphql" // In production, use relative URL which will be handled by Vercel rewrite
  : API_CONFIG.url; // In development, use the full URL from config

const httpLink = createHttpLink({
  uri,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    "Apollo-Require-Preflight": "true",
  },
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
  },
});

export default client;
