"use client"
import React, { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDown, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LUCKY_DRAW_BID_DATA } from "@/components/Data/BidData"
import { TIME_SLOT } from "@/Constants/Time"



const Page = () => {
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [filteredBids, setFilteredBids] = useState<typeof LUCKY_DRAW_BID_DATA>([])
    const [loading, setLoading] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        customerName: "",
        customerPhone: "",
        bidNumber: "",
        bidCount: ""
    })

    // Form errors
    const [errors, setErrors] = useState({
        customerName: "",
        customerPhone: "",
        bidNumber: "",
        bidCount: ""
    })

    useEffect(() => {
        setDate(new Date())
        setSelectedTime("12:00 Am")
    }, [])

    // Filter bids based on selected date and time
    useEffect(() => {
        if (date && selectedTime) {
            const formattedDate = date.toISOString().split('T')[0]
            const filtered = LUCKY_DRAW_BID_DATA.filter(
                bid => bid.date === formattedDate && bid.time === selectedTime
            )
            setFilteredBids(filtered)
        }
    }, [date, selectedTime])

    // Calculate total amount
    const totalAmount = filteredBids.reduce((sum, bid) => sum + bid.bid_count, 0)

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }))
        }
    }

    // Validate form
    const validateForm = () => {
        const newErrors = {
            customerName: "",
            customerPhone: "",
            bidNumber: "",
            bidCount: ""
        }

        let isValid = true
        // Customer Name validation
        if (!formData.customerName.trim()) {
            newErrors.customerName = "Customer name is required"
            isValid = false
        }
        // Customer Phone validation
        if (!formData.customerPhone.trim()) {
            newErrors.customerPhone = "Phone number is required"
            isValid = false
        } else if (!/^[0-9]{10}$/.test(formData.customerPhone)) {
            newErrors.customerPhone = "Phone must be 10 digits"
            isValid = false
        }
        // Bid Number validation
        if (!formData.bidNumber) {
            newErrors.bidNumber = "Bid number is required"
            isValid = false
        } else {
            const bidNum = parseInt(formData.bidNumber)
            if (bidNum < 0 || bidNum > 32) {
                newErrors.bidNumber = "Bid must be between 0-32"
                isValid = false
            }
        }
        // Bid Count validation
        if (!formData.bidCount) {
            newErrors.bidCount = "Bid count is required"
            isValid = false
        } else {
            const bidCnt = parseInt(formData.bidCount)
            if (bidCnt <= 0 || bidCnt > 80) {
                newErrors.bidCount = "Count must be 1-80"
                isValid = false
            }
        }
        setErrors(newErrors)
        return isValid
    }

    // Handle submit
    const handleSubmit = async () => {
    if (!validateForm()) {
        return;
    }
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate unique ID 
    const uniqueId = `LD0056#${formData.customerPhone}#${formData.bidNumber}#${formData.bidCount}`;

    console.log({
        uniqueId, 
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        bidNumber: formData.bidNumber,
        bidCount: formData.bidCount,
        date: date?.toISOString().split('T')[0],
        time: selectedTime
    });

    // Reset form
    setFormData({
        customerName: "",
        customerPhone: "",
        bidNumber: "",
        bidCount: ""
    });

    setLoading(false);
};


    return (
        <div className="bg-[#7F0000] flex flex-col items-center justify-center md:py-20 py-12 min-h-screen">
            <h1 className="text-white text-[32px] md:text-[48px] leading-[100%] mb-8 text-center pt-20 px-4">
                Launch Your Bid Here!
            </h1>

            <div className="flex flex-col w-full space-y-5 px-4">
                {/* date and time */}
                <div className="flex md:flex-row flex-col items-center justify-between bg-white rounded-[22px] max-w-6xl w-full min-h-[100px] px-6 py-4 mx-auto gap-4">

                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-auto justify-between border-[#7F0000] text-primary font-regular text-lg rounded-md hover:bg-primary/10 transition-colors"
                            >
                                {date ? date.toLocaleDateString() : "Select date"}
                                <ChevronDown className="h-4 w-4 ml-1 text-primary" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-auto overflow-hidden p-0 rounded-md border border-[#7F0000]/30"
                            align="start"
                        >
                            <Calendar
                                mode="single"
                                selected={date}
                                captionLayout="dropdown"
                                onSelect={(selectedDate) => {
                                    setDate(selectedDate)
                                    setOpen(false)
                                }}
                            />
                        </PopoverContent>
                    </Popover>

                    <div className="flex flex-row gap-4 flex-wrap justify-center md:justify-end">
                        {TIME_SLOT.map((slot) => (
                            <div
                                key={slot.time}
                                style={{
                                    display: "inline-block",
                                    filter: selectedTime === slot.time
                                        ? "drop-shadow(0 4px 8px rgba(127, 0, 0, 0.4))"
                                        : "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
                                }}
                            >
                                <Button
                                    style={{
                                        clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)",
                                    }}
                                    variant="outline"
                                    onClick={() => setSelectedTime(slot.time)}
                                    className={`justify-center text-primary font-regular text-base md:text-lg py-5 px-4 md:px-6 rounded-none transition-colors border-none
                                        ${selectedTime === slot.time
                                            ? "bg-primary text-white"
                                            : "bg-white hover:bg-primary hover:text-white"
                                        }`}
                                >
                                    {slot.time}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Make a bid  */}
                <div className="flex flex-col items-start justify-center gap-3 bg-white rounded-[22px] max-w-6xl w-full py-5 px-6 mx-auto">
                    <h1 className="text-black text-[20px] md:text-[22px] text-left font-semibold">Make a Bid</h1>
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
                        <div className="flex flex-col">
                            <Input
                                label="Bid Number"
                                type="number"
                                placeholder="0 - 32"
                                name="bidNumber"
                                value={formData.bidNumber}
                                onChange={handleInputChange}
                                min="0"
                                max="32"
                                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            {errors.bidNumber && (
                                <span className="text-red-500 text-xs mt-1">{errors.bidNumber}</span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <Input
                                label="Bid Count"
                                type="number"
                                placeholder="upto 80"
                                name="bidCount"
                                value={formData.bidCount}
                                onChange={handleInputChange}
                                min="1"
                                max="80"
                                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            {errors.bidCount && (
                                <span className="text-red-500 text-xs mt-1">{errors.bidCount}</span>
                            )}
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-primary text-white py-2 px-1 w-full rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed  "
                        >
                            {loading ? "Adding..." : "Add to bucket"}
                        </button>
                    </div>
                    <div className="max-w-4xl w-full flex items-end justify-end text-end text-sm md:text-base">
                        Available count: <span className="ml-1 font-semibold">90</span>
                    </div>
                </div>

                {/* Bid chart */}
                <div className="flex flex-col items-start justify-center gap-3 bg-white rounded-[22px] max-w-6xl w-full py-5 px-6 mx-auto">
                    <div className="flex flex-row w-full justify-between max-w-5xl items-center">
                        <h1 className="text-black text-[20px] md:text-[22px] text-left font-semibold">Bid Chart</h1>
                        <h1 className="text-black text-[20px] md:text-[30px] font-regular">7F0000</h1>
                    </div>
                    <div className="flex flex-col gap-3 w-full max-h-[400px] overflow-y-scroll pr-2 custom-scrollbar" style={{ overscrollBehavior: 'contain' }}>
                        {filteredBids.length > 0 ? (
                            <>
                                {filteredBids.map((bid) => (
                                    <div key={bid.id} className="flex md:flex-row flex-col items-start md:items-center gap-3 md:gap-5 w-full">
                                        <div className="flex flex-row items-center justify-between bg-primary/5 p-4 rounded-lg border border-primary/20 hover:shadow-md transition-shadow flex-1 w-full">
                                            <div className="flex flex-row items-center gap-4 md:gap-7">
                                                <div className="bg-primary rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white text-lg md:text-xl font-bold shrink-0">
                                                    {bid.bid_number}
                                                </div>
                                                <div className="flex flex-col ">
                                                    <p className="text-black font-regular text-sm md:text-base">Customer Name <span className="text-base md:text-xl text-primary font-semibold">{bid.customer_name}</span></p>
                                                    <p className="text-black font-regular text-sm md:text-base">Customer Ph <span className="text-base md:text-xl text-primary font-semibold">{bid.customer_phone}</span></p>
                                                    <p className="text-black font-regular text-sm md:text-base">Count <span className="text-base md:text-xl text-primary font-semibold">{bid.bid_count}</span></p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-primary font-bold text-lg md:text-xl">RM {bid.bid_count}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                                            <button className="text-white bg-[#FF9595] hover:bg-[#FF7575] transition-colors p-3 rounded flex-1 md:flex-initial">
                                                <Pencil className="w-5 h-5 mx-auto" />
                                            </button>
                                            <button className="text-white bg-primary hover:bg-primary/90 transition-colors p-3 rounded flex-1 md:flex-initial">
                                                <Trash2 className="w-5 h-5 mx-auto" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Total container - shown after all bids */}
                                <div className="flex flex-row items-center justify-between bg-primary/5 p-4 rounded-lg border border-primary/40 w-full mt-2">
                                    <span className="text-black font-semibold text-lg md:text-xl">Total Amount:</span>
                                    <span className="text-primary font-bold text-xl md:text-2xl">RM {totalAmount}</span>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No bids found for the selected date and time
                            </div>
                        )}
                    </div>
                </div>

                {/* Clear and submit bid button */}
                <div className="flex flex-row items-center justify-between gap-3 rounded-[22px] max-w-6xl w-full py-2 px-6 mx-auto">
                    <button style={{
                        clipPath:
                            "polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                    }}
                        className="bg-white text-primary flex flex-row items-center gap-2 px-4 md:px-5 py-2 text-sm md:text-base hover:bg-gray-100 transition-colors">
                        Clear all <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button style={{
                        clipPath:
                            "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
                    }} className="bg-primary text-white px-4 md:px-5 py-2 text-sm md:text-base hover:bg-primary/90 transition-colors">
                        Confirm Bid
                    </button>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #D00000;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #D00000;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background-color: #D0000033;
                    border-radius: 4px;
                }
            `}</style>
        </div>
    )
}

export default Page