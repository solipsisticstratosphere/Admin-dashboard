// src/apollo.ts
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { API_CONFIG } from "./config/api.config";

const httpLink = createHttpLink({
  uri: API_CONFIG.url,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    "Apollo-Require-Preflight": "true",
  },
});

const authLink = setContext((_, { headers }) => {
  // Получаем токен из localStorage
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
