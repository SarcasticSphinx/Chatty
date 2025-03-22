import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import SideAnimatedBlock from "../components/SideAnimatedBlock";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const { signUp, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.full_name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    if (!formData.email.includes("@") || !formData.email.includes(".com")) {
      toast.error("Invalid email");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      signUp(formData);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="card bg-base-100">
            <div className="card-body">
              <h1 className="text-3xl font-bold text-center">Create Account</h1>
              <p className="text-center mb-6 text-gray-400">
                Get started with your free account
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label" htmlFor="full_name">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    className="input input-bordered w-full"
                    placeholder="John Doe"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                  />
                </div>

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
                  disabled={isSigningUp}
                >
                  {isSigningUp ? "Creating Account..." : "Sign Up"}
                </button>
              </form>

              <p className="text-center mt-4 text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Animation */}
      <div className="hidden lg:block w-1/2">
        <SideAnimatedBlock auth="signUp" />
      </div>
    </div>
  );
};

export default SignUpPage;