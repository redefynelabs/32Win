"use client";

import { Poster } from "@/components/Reusable/Images";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState, FormEvent } from "react";
import bcrypt from "bcryptjs";
import ContainerLayout from "@/layout/ContainerLayout";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {
      username: "",
      password: "",
    };
    let isValid = true;

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(formData.password, salt);

      // Log form values with hashed password
      console.log("Form Submitted:");
      console.log({
        username: formData.username,
        password: formData.password, // Original password
        hashedPassword: hashedPassword, // Hashed password
      });

      // Reset form after successful submission
      setFormData({
        username: "",
        password: "",
      });
      setErrors({
        username: "",
        password: "",
      });

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error hashing password:", error);
      setErrors({
        ...errors,
        password: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  return (
    <ContainerLayout>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 py-10 b">
        {/* Left Side - Poster Image */}
        <div className="flex justify-center items-center w-full lg:w-auto">
          <Image
            src={Poster}
            alt="Login Poster"
            width={420}
            height={500}
            className="rounded-2xl shadow-md object-cover max-w-[350px] sm:max-w-[400px] lg:max-w-[420px] h-auto"
            priority
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col items-start justify-center rounded-2xl w-full max-w-md p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Login
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mb-6">
            Login to access your account
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
              <Input
                type="text"
                name="username"
                label="Username"
                placeholder="91xxxxxxxx99"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <Input
                type="password"
                name="password"
                label="Password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary text-white py-2.5 rounded-[4px] font-semibold hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ContainerLayout>
  );
};

export default Page;