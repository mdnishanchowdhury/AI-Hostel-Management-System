import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  RouterProvider,
} from "react-router-dom";
import AuthProvider from './Provider/AuthProvider.jsx';
import { router } from './routers/router.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
