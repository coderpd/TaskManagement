'use client'
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Assuming you still want labels for the fields

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  // Form Submission Handler
  const onSubmit = async (data) => {
    // Check if passwords match
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // API call to the signup endpoint
      const response = await axios.post("http://localhost:5000/signup", {
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (response.status === 201) {
        alert("Sign up successful! Redirecting to login...");
        router.push("/login");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        alert("Email already registered. Please use a different email.");
      } else {
        alert("Error signing up: " + error.message);
      }
    }
  };

  return (
    <div className="flex p-10 bg-purple-300 min-h-screen">
      {/* Left side: Sign Up Form */}
      <div className="w-full  md:w-1/2 flex flex-col justify-center items-center bg-gray-100 px-4 py-8">
        <Card className="w-full p-10 max-w-sm bg-white shadow-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
          <h1 className="text-xl font-semibold text-center">Sign Up</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username Field */}
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register("username", { required: "Username is required" })}
                placeholder="Username"
              />
              {errors.username && (
                <span className="text-red-500 text-sm">{errors.username.message}</span>
              )}
            </div>

            {/* Email Field */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                placeholder="Email"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                type="password"
                placeholder="Password"
              />
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password.message}</span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
                type="password"
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-purple-500 text-white w-full h-[50px] hover:bg-purple-800">
              Sign Up
            </Button>
          </form>
        </Card>
      </div>

      {/* Right side: Image and Quote */}
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




// 'use client'
// import React from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label"; // Assuming you still want labels for the fields

// export default function SignUp() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();
//   const router = useRouter();

//   // Form Submission Handler
//   const onSubmit = async (data) => {
//     // Check if passwords match
//     if (data.password !== data.confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     try {
//       // API call to the signup endpoint
//       const response = await axios.post("http://localhost:5000/signup", {
//         username: data.username,
//         email: data.email,
//         password: data.password,
//       });

//       if (response.status === 201) {
//         alert("Sign up successful! Redirecting to login...");
//         router.push("/login");
//       }
//     } catch (error) {
//       if (error.response?.status === 400) {
//         alert("Email already registered. Please use a different email.");
//       } else {
//         alert("Error signing up: " + error.message);
//       }
//     }
//   };

//   return (
//     <div className="flex p-10 bg-purple-300 min-h-screen">
//       {/* Left side: Sign Up Form */}
//       <div className="w-full  md:w-1/2 flex flex-col justify-center items-center bg-gray-100 px-4 py-8">
//         <Card className="w-full p-10 max-w-sm bg-white shadow-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
//           <h1 className="text-xl font-semibold text-center">Sign Up</h1>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             {/* Username Field */}
//             <div>
//               <Label htmlFor="username">Username</Label>
//               <Input
//                 id="username"
//                 {...register("username", { required: "Username is required" })}
//                 placeholder="Username"
//               />
//               {errors.username && (
//                 <span className="text-red-500 text-sm">{errors.username.message}</span>
//               )}
//             </div>

//             {/* Email Field */}
//             <div>
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 {...register("email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                     message: "Invalid email address",
//                   },
//                 })}
//                 type="email"
//                 placeholder="Email"
//               />
//               {errors.email && (
//                 <span className="text-red-500 text-sm">{errors.email.message}</span>
//               )}
//             </div>

//             {/* Password Field */}
//             <div>
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 {...register("password", {
//                   required: "Password is required",
//                   minLength: {
//                     value: 6,
//                     message: "Password must be at least 6 characters",
//                   },
//                 })}
//                 type="password"
//                 placeholder="Password"
//               />
//               {errors.password && (
//                 <span className="text-red-500 text-sm">{errors.password.message}</span>
//               )}
//             </div>

//             {/* Confirm Password Field */}
//             <div>
//               <Label htmlFor="confirmPassword">Confirm Password</Label>
//               <Input
//                 id="confirmPassword"
//                 {...register("confirmPassword", {
//                   required: "Please confirm your password",
//                 })}
//                 type="password"
//                 placeholder="Confirm Password"
//               />
//               {errors.confirmPassword && (
//                 <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
//               )}
//             </div>

//             {/* Submit Button */}
//             <Button type="submit" className="w-full bg-purple-500 text-white w-full h-[50px] hover:bg-purple-800">
//               Sign Up
//             </Button>
//           </form>
//         </Card>
//       </div>

//       {/* Right side: Image and Quote */}
//       <div
//         className="hidden md:flex w-full md:w-1/2 justify-center items-center bg-cover bg-center"
//         style={{
//           backgroundImage: `url('https://cdn.pixabay.com/photo/2017/01/08/20/25/abstract-1963884_1280.jpg')`,
//         }}
//       >
//         <h1 className="text-4xl font-bold font-mono text-white text-center p-4">
//           "Streamline your workflow, conquer your goals – TaskManagement makes productivity effortless!"
//         </h1>
//       </div>
//     </div>
//   );
// }
