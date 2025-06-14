
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SupabaseAppDataProvider } from "@/contexts/SupabaseAppDataContext";
import { Toaster } from "@/components/ui/toaster";
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SupabaseAppDataProvider>
          <App />
          <Toaster />
        </SupabaseAppDataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
