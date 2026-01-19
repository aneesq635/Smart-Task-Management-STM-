"use client";

import React from "react";
import Header from "../components/Header";
import AuthCard from "../components/AuthCard";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      
      {/* Header stays visible */}
      <Header hideAuthButtons={true} />

      <main className="flex items-center justify-center p-6">
        <AuthCard />
      </main>
    </div>
  );
};

export default LoginPage;
