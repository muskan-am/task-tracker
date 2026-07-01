/**
 * @file App.jsx
 * @description Root component. Sets up routing, global providers,
 * the app shell (Navbar + Sidebar + content), and the Toast container.
 */

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { TaskProvider } from "./context/TaskContext";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <BrowserRouter>
      <TaskProvider>
        {/* Full-height app shell */}
        <div className="flex h-screen overflow-hidden bg-slate-50">
          {/* Sidebar — persistent on desktop, drawer on mobile */}
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

          {/* Main column */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <Navbar
              onMenuToggle={toggleSidebar}
              isSidebarOpen={sidebarOpen}
            />

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </div>

        {/* Global toast notifications */}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
          toastClassName="!rounded-xl !shadow-lg !text-sm !font-medium"
        />
      </TaskProvider>
    </BrowserRouter>
  );
};

export default App;
