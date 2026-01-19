"use client";
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import supabase from "./supabase";

const AuthContext = createContext({
user: null,
loading: true,
});

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const mounted = useRef(true);

useEffect(() => {
mounted.current = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted.current) {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted.current) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted.current = false;
      subscription?.unsubscribe();
    };

}, []);

return (
<AuthContext.Provider value={{ user, loading }}>
{children}
</AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);
