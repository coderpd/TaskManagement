"use client"; // Convert the component to a Client Component

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminLoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter(); // To handle redirect after successful login

  // Submit function for login
  const onSubmit = async (data) => {
    try {
      // Send login request to the backend
      const response = await axios.post("http://localhost:5000/admin/login", {
        email: data.email,
        password: data.password,
      });

      // Save token in localStorage
      localStorage.setItem("adminToken", response.data.token);

      // Redirect to Admin Dashboard
      router.push("/admindashboard");
    } catch (error) {
      setErrorMessage("Invalid credentials. Please try again.");
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>

      <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 to-blue-700 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="w-[150%] h-[150%] bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        </div>

        {/* Login Card */}
        <div className="relative z-10 bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
            Admin Login
          </h1>
          <p className="text-center text-gray-600 mb-6 text-lg">
            Log in to manage users and oversee task assignments.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className="w-full px-4 py-3 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "Password is required",
                })}
                className="w-full px-4 py-3 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Sign In Button */}
            <Button
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-all duration-300 ease-in-out rounded-lg py-3 text-lg font-medium shadow-lg"
              type="submit"
            >
              Sign In as Admin
            </Button>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 text-center text-red-600">
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              © 2025 TaskMaster. All Rights Reserved.
            </p>
            <p className="text-sm text-gray-500">
              Built with{" "}
              <span className="font-semibold text-indigo-600">
                Next.js, Tailwind CSS
              </span>{" "}
              & ShadCN.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
