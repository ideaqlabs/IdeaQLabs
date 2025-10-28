import React from "react";

const Dashboard = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <h1 className="text-5xl font-bold mb-6 text-sky-400">User Dashboard</h1>
      <p className="text-lg text-gray-300 max-w-2xl mb-10">
        Welcome to your personal Dashboard. Here you’ll soon be able to manage your account,
        track progress, and view your activities.
      </p>
      <div className="bg-slate-800/50 p-8 rounded-2xl shadow-lg backdrop-blur-sm border border-slate-700">
        <p className="text-gray-400 italic">Dashboard features coming soon...</p>
      </div>
    </section>
  );
};

export default Dashboard;
