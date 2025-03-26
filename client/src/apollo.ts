// src/apollo.ts
import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { API_CONFIG } from "./config/api.config";

// Error handling link - перехватываем ошибки только для логирования, но не показываем в консоли
// Отображение ошибок будет происходить в самих компонентах через toast уведомления
const errorLink = onError(() => {
  // Просто перехватываем ошибки, но не логируем их в консоли
  // Это позволит обрабатывать ошибки в компонентах через onError или try/catch
});

// Auth link to add token to requests
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// API URL - use absolute URL in production for reliability
const apiUrl = API_CONFIG.isProduction
  ? "https://admin-dashboard-o49z.onrender.com/graphql"
  : API_CONFIG.url || "http://localhost:3001/graphql";

console.log("GraphQL URI:", apiUrl);

// Http link for API connection
const httpLink = new HttpLink({
  uri: apiUrl,
  credentials: "include",
});

// Create Apollo Client instance
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
  },
});

export default client;
