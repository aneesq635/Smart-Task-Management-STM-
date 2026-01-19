"use client";

import React, { useState } from "react";
import {
Mail,
Lock,
Eye,
EyeOff,
Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import supabase from "./supabase";
import { useSnackbar } from "notistack";

const AuthCard = () => {
const [isSignUp, setIsSignUp] = useState(false);
const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const router = useRouter();
const { enqueueSnackbar } = useSnackbar();

const [formData, setFormData] = useState({
firstName: "",
lastName: "",
dob: "",
emailOrPhone: "",
password: "",
});

const handleInputChange = (e) => {
const { name, value } = e.target;
setFormData((prev) => ({ ...prev, [name]: value }));
};

const resetAuthFields = () => {
setFormData({
firstName: "",
lastName: "",
dob: "",
emailOrPhone: "",
password: "",
});
};

const handleAuth = async (e) => {
e.preventDefault();
setLoading(true);

    try {
      const contact = formData.emailOrPhone.trim();
      const isEmail = contact.includes("@");

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          [isEmail ? "email" : "phone"]: contact,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              date_of_birth: formData.dob,
            },
          },
        });
        if (error) throw error;
        enqueueSnackbar("Success! Check your email if required.", { variant: "success" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          [isEmail ? "email" : "phone"]: contact,
          password: formData.password,
        });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setLoading(false);
    }

};

return (
<div
      className="
        w-full max-w-md mx-auto rounded-[2.5rem] border shadow-2xl p-10
        bg-white dark:bg-slate-900
        border-slate-100 dark:border-slate-800
        transition-colors
      "
    >
<h2 className="text-3xl font-extrabold mb-2 tracking-tight text-slate-900 dark:text-white">
{isSignUp ? "Get Started" : "Welcome Back"}
</h2>

      <p className="text-sm mb-8 text-slate-500 dark:text-slate-400">
        {isSignUp ? "Create your account." : "Continue your journey."}
      </p>

      <form className="space-y-4" onSubmit={handleAuth} autoComplete="off">
        {isSignUp && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstName"
                value={formData.firstName}
                placeholder="First"
                onChange={handleInputChange}
                autoComplete="given-name"
                className="
                  w-full h-14 pl-4 rounded-2xl border outline-none
                  bg-slate-50 dark:bg-slate-800
                  border-slate-100 dark:border-slate-700
                  text-slate-900 dark:text-white
                  focus:border-indigo-500
                "
              />
              <input
                name="lastName"
                value={formData.lastName}
                placeholder="Last"
                onChange={handleInputChange}
                autoComplete="family-name"
                className="
                  w-full h-14 pl-4 rounded-2xl border outline-none
                  bg-slate-50 dark:bg-slate-800
                  border-slate-100 dark:border-slate-700
                  text-slate-900 dark:text-white
                  focus:border-indigo-500
                "
              />
            </div>

            <input
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleInputChange}
              autoComplete="bday"
              max={new Date(
                new Date().setFullYear(new Date().getFullYear() - 7)
              ).toISOString().split("T")[0]}
              className="
                w-full h-14 pl-4 rounded-2xl border outline-none
                bg-slate-50 dark:bg-slate-800
                border-slate-100 dark:border-slate-700
                text-slate-900 dark:text-white
                focus:border-indigo-500
              "
            />
          </>
        )}

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            name="emailOrPhone"
            value={formData.emailOrPhone}
            placeholder="Email or Phone"
            onChange={handleInputChange}
            autoComplete="username"
            className="
              w-full h-14 pl-12 rounded-2xl border outline-none
              bg-slate-50 dark:bg-slate-800
              border-slate-100 dark:border-slate-700
              text-slate-900 dark:text-white
              focus:border-indigo-500
            "
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            autoComplete="new-password"
            className="
              w-full h-14 pl-12 pr-12 rounded-2xl border outline-none
              bg-slate-50 dark:bg-slate-800
              border-slate-100 dark:border-slate-700
              text-slate-900 dark:text-white
              focus:border-indigo-500
            "
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            w-full bg-indigo-600 text-white h-14 rounded-2xl
            flex items-center justify-center gap-2 font-bold
            shadow-xl transition-all active:scale-95
          "
        >
          {loading ? <Loader2 className="animate-spin" /> : isSignUp ? "Create Account" : "Sign In"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button
          onClick={() => {
            resetAuthFields();
            setIsSignUp(!isSignUp);
          }}
          className="text-indigo-600 font-bold hover:underline"
        >
          {isSignUp ? "Already have an account? Sign In" : "New to MindSync? Create Account"}
        </button>
      </div>
    </div>

);
};

export default AuthCard;
