import React from "react";

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-zinc-50 pt-10 flex flex-col items-center px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl justify-center pb-10 items-center flex font-bold text-zinc-900">ANJAY <span className="text-emerald-600">STORE</span></h1>
      <div className="max-w-md w-full space-y-4 bg-white p-10 rounded-3xl shadow-xl">
        {children}
      </div>
    </div>
  );
};

export default LoginLayout;
