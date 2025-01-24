'use client';
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiMinutemailer } from "react-icons/si";
import { FaLock } from "react-icons/fa6";
import Link from "next/link";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email: data.email,
        password: data.password,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        router.push("/dashboard");
      }
    } catch (error) {
      alert("Error logging in: " + error.message);
    }
  };

  return (
    <div className="flex flex-col p-10 bg-purple-400 rou md:flex-row min-h-screen">
      {/* Left section */}
      <div className="flex flex-col  justify-center rounded-sm items-center bg-gray-100 w-full md:w-1/2 px-4 py-8">
        <Card className="w-full p-10 max-w-sm bg-white shadow-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
          <h1 className="text-2xl font-semibold text-center mb-4">Login</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email" className="block mb-1">
                Email
              </Label>
              <div className="relative">
                <Input
                  {...register("email", { required: true })}
                  id="email"
                  className="w-full hover:border-purple-600"
                  placeholder="Enter your email"
                />
                <SiMinutemailer className="absolute right-3 top-2 text-2xl text-gray-500" />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">Email is required</p>}
            </div>
            <div>
              <Label htmlFor="password" className="block mb-1 mt-6">
                Password
              </Label>
              <div className="relative">
                <Input
                  {...register("password", { required: true })}
                  id="password"
                  type="password"
                  className="w-full hover:border-purple-600"
                  placeholder="Enter your password"
                />
                <FaLock className="absolute right-3 top-2 text-xl text-gray-500" />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">Password is required</p>}
            </div>
            <Button type="submit" className="bg-purple-500 text-white w-full hover:bg-purple-800">
              Login
            </Button>
            <div className="text-center flex justify-center gap-1 mt-2">
              <span className="text-sm text-gray-500">Don't have an account?</span>
              <Link href="/signup" className="text-base text-purple-500 hover:text-purple-800">
                Signup
              </Link>
            </div>
          </form>
        </Card>
      </div>

      {/* Right Section */}
      <div
        className="hidden md:flex w-full md:w-1/2 justify-center items-center bg-cover bg-center"
        style={{
          backgroundImage: `url('https://cdn.pixabay.com/photo/2017/01/08/20/25/abstract-1963884_1280.jpg')`,
        }}
      >
        <h1 className="text-4xl font-bold font-mono text-white text-center p-4">
          "Streamline your workflow, conquer your goals – TaskManagement makes productivity effortless!"
        </h1>
      </div>
    </div>
  );
}
