import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./components/App/App.tsx";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo.ts";
import { AuthProvider } from "./context/AuthContext";
import { EditModeProvider } from "./context/EditModeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <EditModeProvider>
          <App />
        </EditModeProvider>
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>
);
