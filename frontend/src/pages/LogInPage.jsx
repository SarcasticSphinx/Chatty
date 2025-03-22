import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import SideAnimatedBlock from "../components/SideAnimatedBlock";
import { Eye, EyeOff } from "lucide-react";

const LogInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { logIn, isLoggingIn } = useAuthStore();

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return false;
    }
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await logIn(formData);
      } catch (error) {
        // Error is already handled in the store
        console.log("Login failed:", error);
      }
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 h-full">
        <div className="w-full max-w-sm">
          <div className="card bg-base-100">
            <div className="card-body">
              <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
              <p className="text-center mb-6 text-gray-400">
                Log in to your account
              </p>
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label" htmlFor="email">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="input input-bordered w-full"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value.trim() })
                    }
                  />
                </div>

                <div className="form-control mb-6">
                  <label className="label" htmlFor="password">
                    <span className="label-text">Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="input input-bordered w-full"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? "Logging in..." : "Log In"}
                </button>
              </form>
              <p className="text-center mt-4 text-gray-400">
                Don't have an account?{" "}
                <Link to="/signUp" className="text-primary hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Animation */}
      <div className="hidden lg:block w-1/2">
        <SideAnimatedBlock auth="logIn" />
      </div>
    </div>
  );
};

export default LogInPage;