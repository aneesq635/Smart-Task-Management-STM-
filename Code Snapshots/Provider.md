"use client";
import { AuthProvider } from "./AuthContext.jsx";
import { SnackbarProvider } from "notistack";

export function Providers({ children }) {
return (
<AuthProvider>
<SnackbarProvider
maxSnack={3}
anchorOrigin={{ vertical: "bottom", horizontal: "left" }} >
{children}
</SnackbarProvider>
</AuthProvider>
);
}
