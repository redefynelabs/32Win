"use client";

import { Poster } from "@/components/Reusable/Images";
import { DatePicker } from "@/components/ui/datePicker";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import ContainerLayout from "@/layout/ContainerLayout";
import Image from "next/image";
import React, { useState, FormEvent, useRef } from "react";
import { Upload, X, ImageIcon } from 'lucide-react';
import { useRouter } from "next/navigation";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dob: string;
  otp: string;
  amount: string;
  image: File | null;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  dob?: string;
  otp?: string;
  amount?: string;
  image?: string;
}

const Page = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    dob: "",
    otp: "",
    amount: "",
    image: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null) => {
    setFormData({
      ...formData,
      image: file,
    });
    
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview("");
    }

    if (errors.image) {
      setErrors({
        ...errors,
        image: "",
      });
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    handleFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
      isValid = false;
    } else {
      const age = new Date().getFullYear() - new Date(formData.dob).getFullYear();
      if (age < 18) {
        newErrors.dob = "You must be at least 18 years old";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required";
      isValid = false;
    } else if (formData.otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits";
      isValid = false;
    } else if (formData.otp !== generatedOTP) {
      newErrors.otp = "Invalid OTP";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.amount.trim()) {
      newErrors.amount = "Amount is required";
      isValid = false;
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
      isValid = false;
    } else if (Number(formData.amount) < 500) {
      newErrors.amount = "Amount must be at least 500";
      isValid = false;
    }

    if (!formData.image) {
      newErrors.image = "Image is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    console.log("Generated OTP:", otp);
    alert(`Your OTP is: ${otp}`);
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      generateOTP();
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateStep3()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Form Submitted Successfully:");
      console.log({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        gender: formData.gender,
        dob: formData.dob,
        amount: formData.amount,
        image: formData.image ? formData.image.name : null,
      });

      alert("Form submitted successfully! Check console for details.");

      // Reset the form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        dob: "",
        otp: "",
        amount: "",
        image: null,
      });
      setStep(1);
      setGeneratedOTP("");
      setPreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Redirect to home page
      router.push("/");
      
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset the form? All data will be lost.")) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        dob: "",
        otp: "",
        amount: "",
        image: null,
      });
      setErrors({});
      setStep(1);
      setGeneratedOTP("");
      setPreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <ContainerLayout>
      <div className="flex flex-col lg:flex-row items-center justify-center py-10">
        <div className="flex justify-center items-center lg:mr-8 xl:mr-12 mb-8 lg:mb-0 md:pt-0 pt-20">
          <Image
            src={Poster}
            alt="Sign up Poster"
            width={420}
            height={500}
            className="rounded-2xl shadow-md object-cover max-w-[350px] sm:max-w-[400px] lg:max-w-[420px] h-auto"
            priority
          />
        </div>

        <div className="flex flex-col items-start justify-center rounded-2xl w-full max-w-md">
          <div className="flex justify-between items-center w-full mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Agent Signup
              </h1>
              <p className="text-sm text-gray-600">
                Step {step} of 3
              </p>
            </div>
            {/* <button
              type="button"
              onClick={handleReset}
              className="text-sm text-gray-600 hover:text-primary underline transition-colors"
            >
              Reset Form
            </button> */}
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="text"
                      name="firstName"
                      label="First Name"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      type="text"
                      name="lastName"
                      label="Last Name"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Input
                    type="email"
                    name="email"
                    label="Email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    label="Gender"
                    className={errors.gender ? "border-red-500" : ""}
                    aria-invalid={!!errors.gender}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                  )}
                </div>

                <div>
                  <DatePicker
                    name="dob"
                    label="Date of Birth"
                    placeholder=""
                    value={formData.dob}
                    onChange={handleChange}
                    className={errors.dob ? "border-red-500" : ""}
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-primary text-white py-2.5 rounded-[4px] font-semibold hover:bg-primary/90 transition-all duration-200"
                >
                  Next
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    OTP has been sent to <strong>{formData.email}</strong>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Check console for OTP (in real app, it would be sent via email)
                  </p>
                </div>

                <div>
                  <Input
                    type="text"
                    name="otp"
                    label="Enter OTP"
                    placeholder="000000"
                    maxLength={6}
                    value={formData.otp}
                    onChange={handleChange}
                    className={errors.otp ? "border-red-500" : ""}
                  />
                  {errors.otp && (
                    <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-[4px] font-semibold hover:bg-gray-300 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-primary text-white py-2.5 rounded-[4px] font-semibold hover:bg-primary/90 transition-all duration-200"
                  >
                    Verify OTP
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <Input
                    type="number"
                    name="amount"
                    label="Amount"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className={errors.amount ? "border-red-500" : ""}
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                  )}
                </div>

                <div className="relative w-full">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  
                  <label className="text-muted-foreground pointer-events-none absolute left-2 top-1 -translate-y-1/2 bg-background px-1 text-lg font-regular z-10">
                    Upload Image
                  </label>

                  <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`
                      relative min-h-[120px] w-full rounded-[4px] border-2 border-dashed transition-all
                      ${isDragging ? 'border-primary bg-primary/5' : errors.image ? 'border-red-500' : 'border-gray-300'}
                      ${!formData.image ? 'cursor-pointer' : ''}
                    `}
                    onClick={!formData.image ? handleBrowseClick : undefined}
                  >
                    {!formData.image ? (
                      <div className="flex flex-col items-center justify-center py-8 px-4">
                        <Upload className={`w-10 h-10 mb-3 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium text-primary hover:text-primary/80">Browse</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-4">
                        {preview ? (
                          <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded" />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{formData.image.name}</p>
                          <p className="text-xs text-gray-500">
                            {(formData.image.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    )}
                  </div>

                  {errors.image && (
                    <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-[4px] font-semibold hover:bg-gray-300 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary text-white py-2.5 rounded-[4px] font-semibold hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </ContainerLayout>
  );
};

export default Page;