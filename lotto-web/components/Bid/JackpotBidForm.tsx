import React from "react";
import { Input } from "@/components/ui/input";

interface JackpotBidFormProps {
  formData: {
    customerName: string;
    customerPhone: string;
    bidNumber: string[]; // Changed to array for 6 numbers
  };
  errors: {
    customerName: string;
    customerPhone: string;
    bidNumber: string; // This will now show general bid number errors
    bidCount: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  loading: boolean;
  editingBid: string | null;
}

export const JackpotBidForm = ({
  formData,
  errors,
  handleInputChange,
  handleSubmit,
  loading,
  editingBid
}: JackpotBidFormProps) => {
  // Handle change for individual digit inputs
  const handleDigitChange = (index: number, value: string) => {
    console.log(`Digit ${index} changed to:`, value);
    const newBidNumbers = [...formData.bidNumber];
    newBidNumbers[index] = value;
    console.log("Updated bid numbers array:", newBidNumbers);
    // Create a synthetic event
    const syntheticEvent = {
      target: {
        name: 'bidNumber',
        value: newBidNumbers
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };

  return (
    <div className="grid md:grid-cols-5 grid-cols-1 gap-3 w-full">
      <div className="flex flex-col">
        <Input
          label="Customer Name"
          type="text"
          placeholder="John"
          name="customerName"
          value={formData.customerName}
          onChange={handleInputChange}
        />
        {errors.customerName && (
          <span className="text-red-500 text-xs mt-1">{errors.customerName}</span>
        )}
      </div>
      <div className="flex flex-col">
        <Input
          label="Cust Phone No"
          type="tel"
          placeholder="98xxxxxxxx"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleInputChange}
          maxLength={10}
        />
        {errors.customerPhone && (
          <span className="text-red-500 text-xs mt-1">{errors.customerPhone}</span>
        )}
      </div>
      <div className="md:col-span-2">
        <div className="grid grid-cols-6 gap-2">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="flex flex-col">
              <Input
                type="number"
                placeholder="0"
                value={formData.bidNumber[index] || ""}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                min="0"
                max="32"
                className="text-center"
              />
              {errors.bidNumber && index === 5 && ( 
                <span className="text-red-500 text-xs mt-1">{errors.bidNumber}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Bid Count removed for Jackpot */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-primary text-white py-2 px-1 w-full h-14 rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (editingBid ? "Updating..." : "Adding...") : (editingBid ? "Update" : "Add to bucket")}
      </button>
    </div>
  );
};