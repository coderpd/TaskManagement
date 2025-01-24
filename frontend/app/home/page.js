"use client"; 

import { Button } from '@/components/ui/button';
import Head from 'next/head';
import { useRouter } from 'next/navigation'; 

export default function Homepage() {
  const router = useRouter(); 

  const handleLoginClick = () => {
    router.push('/login'); 
  };

  const handleAdminLoginClick = () => {
    router.push('/admin');
  };

  return (
    <>
      <Head>
        <title>Landing Page</title>
        <meta
          name="description"
          content="Landing Page with Next.js, Tailwind CSS, and ShadCN"
        />
      </Head>

      <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 overflow-hidden">
      
        <div className="absolute inset-0 z-0">
          <div className="w-[200%] h-[200%] bg-gradient-to-br from-blue-300 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        </div>

        {/* Main Card */}
        <div className="relative z-10 bg-white p-10 rounded-xl shadow-2xl max-w-md w-full text-center space-y-8">
          <h1 className="text-4xl font-extrabold text-gray-700 tracking-tight">
            Welcome to <span className="text-purple-600">TaskMaster</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your tasks efficiently and collaborate with your team using our intuitive platform.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-6">
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 ease-in-out rounded-lg py-3 text-lg shadow-lg transform hover:scale-105"
              onClick={handleLoginClick}
            >
              Login
            </Button>
            <Button
              className="w-full bg-green-600 text-white hover:bg-green-700 transition-all duration-300 ease-in-out rounded-lg py-3 text-lg shadow-lg transform hover:scale-105"
              onClick={handleAdminLoginClick}
            >
              Admin Login
            </Button>
          </div>

        
          <div className="border-t border-gray-200 mt-6"></div>

          {/* Footer */}
          <div className="text-sm text-gray-500 mt-4">
            <p>© 2025 TaskMaster. All Rights Reserved.</p>
            <p>
              Built with{' '}
              <span className="text-blue-600 font-medium">
                Next.js, Tailwind CSS
              </span>{' '}
              & ShadCN.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
