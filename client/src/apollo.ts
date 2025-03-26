import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { API_CONFIG } from "./config/api.config";

const errorLink = onError(() => {});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const apiUrl = API_CONFIG.isProduction
  ? "https://admin-dashboard-o49z.onrender.com/graphql"
  : API_CONFIG.url || "http://localhost:3001/graphql";

console.log("GraphQL URI:", apiUrl);

const httpLink = new HttpLink({
  uri: apiUrl,
  credentials: "include",
});

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
