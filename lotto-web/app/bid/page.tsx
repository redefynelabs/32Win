"use client"
import React, { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ChevronDown, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TIME_SLOT } from "@/constants/Time"
import { LuckyDrawBidForm } from "@/components/Bid/LuckyDrawBidForm"
import { JackpotBidForm } from "@/components/Bid/JackpotBidForm"
import { LuckyDrawBidCart } from "@/components/Bid/LuckyDrawBidCart"
import { JackpotBidCart } from "@/components/Bid/JackpotBidCart"



const Page = () => {
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [luckyDrawBidCart, setLuckyDrawBidCart] = useState<BidData[]>([])
    const [jackpotBidCart, setJackpotBidCart] = useState<JackpotBidData[]>([])
    const [loading, setLoading] = useState(false)
    const [editingBid, setEditingBid] = useState<string | null>(null)
    const [confirmDialog, setConfirmDialog] = useState<{ open: boolean, type: 'clear' | 'submit' | null }>({ open: false, type: null })
    const [activeSection, setActiveSection] = useState("lucky");

    // Form state for Lucky Draw
    const [luckyDrawFormData, setLuckyDrawFormData] = useState({
        customerName: "",
        customerPhone: "",
        bidNumber: "",
        bidCount: ""
    })

    // Form state for Jackpot
    const [jackpotFormData, setJackpotFormData] = useState({
        customerName: "",
        customerPhone: "",
        bidNumber: Array(6).fill(""),
    })

    // Form errors
    const [errors, setErrors] = useState({
        customerName: "",
        customerPhone: "",
        bidNumber: "",
        bidCount: ""
    })

   

    // Initialize with current date and check time slot
    useEffect(() => {
        const now = new Date()
        setDate(now)

        // Determine current time slot
        const currentHour = now.getHours()
        let currentSlot = '12:00 Am'

        if (currentHour >= 0 && currentHour < 12) {
            currentSlot = '12:00 Am'
        } else if (currentHour >= 12 && currentHour < 16) {
            currentSlot = '12:00 Pm'
        } else if (currentHour >= 16 && currentHour < 20) {
            currentSlot = '04:00 Pm'
        } else {
            currentSlot = '08:00 Pm'
        }

        setSelectedTime(currentSlot)
    }, [])

    // Check if a time slot should be disabled
    const isTimeSlotDisabled = (timeSlot: string) => {
        if (!date) return false

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const selectedDate = new Date(date)
        selectedDate.setHours(0, 0, 0, 0)

        // If selected date is not today, all slots are enabled
        if (selectedDate.getTime() !== today.getTime()) {
            return false
        }

        // If today, check current time
        const now = new Date()
        const currentHour = now.getHours()

        // Map time slots to hours
        const slotHours: { [key: string]: number } = {
            '12:00 Am': 0,
            '12:00 Pm': 12,
            '04:00 Pm': 16,
            '08:00 Pm': 20
        }

        const slotHour = slotHours[timeSlot]

        // Disable if slot time has passed
        return currentHour >= slotHour
    }

    // Calculate available count for a specific bid number
    const getAvailableCount = (bidNumber: number) => {
        const filteredBids = luckyDrawBidCart.filter(
            bid => bid.bid_number === bidNumber &&
                bid.date === date?.toISOString().split('T')[0] &&
                bid.time === selectedTime &&
                bid.id !== editingBid
        )
        const usedCount = filteredBids.reduce((sum, bid) => sum + bid.bid_count, 0)
        return 80 - usedCount
    }

    // Calculate total amount
    const totalAmount = (activeSection === "lucky" ? luckyDrawBidCart : jackpotBidCart)
        .filter(bid => bid.date === date?.toISOString().split('T')[0] && bid.time === selectedTime)
        .reduce((sum: number, bid: any) => sum + bid.bid_count, 0)

    // Get filtered bids for display
    const filteredBids = (activeSection === "lucky" ? luckyDrawBidCart : jackpotBidCart).filter(
        (bid: any) => bid.date === date?.toISOString().split('T')[0] && bid.time === selectedTime
    )

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        console.log("Input changed:", name, value);
        console.log("Active section:", activeSection);
        
        if (activeSection === "lucky") {
            setLuckyDrawFormData(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            // For Jackpot
            if (name !== 'bidCount') {
                setJackpotFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
        }
        
        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
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
        if (activeSection === "lucky") {
            if (!luckyDrawFormData.customerName.trim()) {
                newErrors.customerName = "Customer name is required"
                isValid = false
            }
        } else {
            if (!jackpotFormData.customerName.trim()) {
                newErrors.customerName = "Customer name is required"
                isValid = false
            }
        }

        // Customer Phone validation
        if (activeSection === "lucky") {
            if (!luckyDrawFormData.customerPhone.trim()) {
                newErrors.customerPhone = "Phone number is required"
                isValid = false
            } else if (!/^[0-9]{10}$/.test(luckyDrawFormData.customerPhone)) {
                newErrors.customerPhone = "Phone must be 10 digits"
                isValid = false
            }
        } else {
            if (!jackpotFormData.customerPhone.trim()) {
                newErrors.customerPhone = "Phone number is required"
                isValid = false
            } else if (!/^[0-9]{10}$/.test(jackpotFormData.customerPhone)) {
                newErrors.customerPhone = "Phone must be 10 digits"
                isValid = false
            }
        }

        // Bid Number validation - different for each section
        if (activeSection === "lucky") {
            if (!luckyDrawFormData.bidNumber) {
                newErrors.bidNumber = "Bid number is required"
                isValid = false
            } else {
                const bidNum = parseInt(luckyDrawFormData.bidNumber as string)
                if (isNaN(bidNum) || bidNum < 0 || bidNum > 32) {
                    newErrors.bidNumber = "Bid must be between 0-32"
                    isValid = false
                }
            }
        } else {
            // Jackpot validation - check all 6 numbers
            if (!jackpotFormData.bidNumber || jackpotFormData.bidNumber.length !== 6) {
                newErrors.bidNumber = "All 6 bid numbers are required"
                isValid = false
            } else {
                const hasEmpty = jackpotFormData.bidNumber.some(num => !num);
                if (hasEmpty) {
                    newErrors.bidNumber = "All 6 bid numbers are required"
                    isValid = false
                } else {
                    const invalidNumber = jackpotFormData.bidNumber.some(num => {
                        const bidNum = parseInt(num);
                        return isNaN(bidNum) || bidNum < 0 || bidNum > 32;
                    });
                    if (invalidNumber) {
                        newErrors.bidNumber = "All bid numbers must be between 0-32"
                        isValid = false
                    }
                }
            }
        }

        // Bid Count validation - only for Lucky Draw
        if (activeSection === "lucky") {
            if (!luckyDrawFormData.bidCount) {
                newErrors.bidCount = "Bid count is required"
                isValid = false
            } else {
                const bidCnt = parseInt(luckyDrawFormData.bidCount)
                const availableCount = 80; // For both sections, using 80 for now

                if (bidCnt <= 0) {
                    newErrors.bidCount = "Count must be at least 1"
                    isValid = false
                } else if (bidCnt > availableCount) {
                    newErrors.bidCount = `Only ${availableCount} available`
                    isValid = false
                }
            }
        }

        setErrors(newErrors)
        console.log("Validation result:", isValid);
        console.log("Validation errors:", newErrors);
        return isValid
    }

    // Handle submit
    const handleSubmit = async () => {
        console.log("handleSubmit called");
        console.log("Active section:", activeSection);
        console.log("Lucky Draw Form Data:", luckyDrawFormData);
        console.log("Jackpot Form Data:", jackpotFormData);
        
        if (!validateForm() || !date || !selectedTime) {
            console.log("Validation failed or missing date/time");
            console.log("Errors:", errors);
            return
        }

        setLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        if (activeSection === "lucky") {
            const bidData: BidData = {
                id: editingBid || `LD0056#${luckyDrawFormData.customerPhone}#${luckyDrawFormData.bidNumber}#${Date.now()}`,
                customer_name: luckyDrawFormData.customerName,
                customer_phone: luckyDrawFormData.customerPhone,
                bid_number: parseInt(luckyDrawFormData.bidNumber as string),
                bid_count: parseInt(luckyDrawFormData.bidCount),
                date: date.toISOString().split('T')[0],
                time: selectedTime
            }

            console.log('Bid Data:', {
                uniqueId: bidData.id,
                customerName: bidData.customer_name,
                customerPhone: bidData.customer_phone,
                bidNumber: bidData.bid_number,
                bidCount: bidData.bid_count,
                date: bidData.date,
                time: bidData.time
            })

            if (editingBid) {
                setLuckyDrawBidCart(prev => prev.map(bid => bid.id === editingBid ? bidData : bid))
                setEditingBid(null)
            } else {
                setLuckyDrawBidCart(prev => [...prev, bidData])
            }
        } else {
            // Jackpot submission - no bid count
            const jackpotBidData: JackpotBidData = {
                id: editingBid || `JP0056#${jackpotFormData.customerPhone}#${jackpotFormData.bidNumber.join('-')}#${Date.now()}`,
                customer_name: jackpotFormData.customerName,
                customer_phone: jackpotFormData.customerPhone,
                bid_numbers: jackpotFormData.bidNumber.map(num => {
                    const parsed = parseInt(num);
                    return isNaN(parsed) ? 0 : parsed;
                }),
                bid_count: 1, // Default to 1 for Jackpot
                date: date.toISOString().split('T')[0],
                time: selectedTime
            }

            console.log('Jackpot Bid Data:', {
                uniqueId: jackpotBidData.id,
                customerName: jackpotBidData.customer_name,
                customerPhone: jackpotBidData.customer_phone,
                bidNumbers: jackpotBidData.bid_numbers,
                bidCount: jackpotBidData.bid_count,
                date: jackpotBidData.date,
                time: jackpotBidData.time
            })

            if (editingBid) {
                setJackpotBidCart(prev => prev.map(bid => bid.id === editingBid ? jackpotBidData : bid))
                setEditingBid(null)
            } else {
                setJackpotBidCart(prev => [...prev, jackpotBidData])
            }
        }

        // Reset form
        if (activeSection === "lucky") {
            setLuckyDrawFormData({
                customerName: "",
                customerPhone: "",
                bidNumber: "",
                bidCount: ""
            });
        } else {
            setJackpotFormData({
                customerName: "",
                customerPhone: "",
                bidNumber: Array(6).fill(""),
            });
        }

        setLoading(false)
    }

    // Handle edit
    const handleEdit = (bid: any) => {
        if (activeSection === "lucky") {
            setLuckyDrawFormData({
                customerName: bid.customer_name,
                customerPhone: bid.customer_phone,
                bidNumber: bid.bid_number.toString(),
                bidCount: bid.bid_count.toString()
            })
        } else {
            setJackpotFormData({
                customerName: bid.customer_name,
                customerPhone: bid.customer_phone,
                bidNumber: bid.bid_numbers.map((num: number) => num.toString()),
            })
        }
        setEditingBid(bid.id)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Handle delete
    const handleDelete = (id: string) => {
        if (activeSection === "lucky") {
            setLuckyDrawBidCart(prev => prev.filter(bid => bid.id !== id))
        } else {
            setJackpotBidCart(prev => prev.filter(bid => bid.id !== id))
        }
        if (editingBid === id) {
            setEditingBid(null)
            if (activeSection === "lucky") {
                setLuckyDrawFormData({
                    customerName: "",
                    customerPhone: "",
                    bidNumber: "",
                    bidCount: ""
                })
            } else {
                setJackpotFormData({
                    customerName: "",
                    customerPhone: "",
                    bidNumber: Array(6).fill(""),
                })
            }
        }
    }

    // Handle clear all
    const handleClearAll = () => {
        if (!date || !selectedTime) return

        const currentDateTimeKey = `${date.toISOString().split('T')[0]}-${selectedTime}`
        if (activeSection === "lucky") {
            setLuckyDrawBidCart(prev => prev.filter(bid => `${bid.date}-${bid.time}` !== currentDateTimeKey))
        } else {
            setJackpotBidCart(prev => prev.filter(bid => `${bid.date}-${bid.time}` !== currentDateTimeKey))
        }
        setConfirmDialog({ open: false, type: null })
        console.log('Cleared all bids for:', currentDateTimeKey)
    }

    // Handle confirm bid
    const handleConfirmBid = () => {
        if (!date || !selectedTime) return

        const currentBids = (activeSection === "lucky" ? luckyDrawBidCart : jackpotBidCart).filter(
            (bid: any) => bid.date === date.toISOString().split('T')[0] && bid.time === selectedTime
        )

        console.log('Confirmed Bids:', {
            date: date.toISOString().split('T')[0],
            time: selectedTime,
            totalBids: currentBids.length,
            totalAmount,
            bids: currentBids
        })

        setConfirmDialog({ open: false, type: null })

        // Here you would typically send data to backend
        alert('Bids confirmed successfully!')
    }

    // Check if date is within next 7 days
    const isDateInRange = (checkDate: Date) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const maxDate = new Date(today)
        maxDate.setDate(today.getDate() + 7)

        const check = new Date(checkDate)
        check.setHours(0, 0, 0, 0)

        return check >= today && check <= maxDate
    }

    // Add useEffect to reset form when switching sections
    useEffect(() => {
        setEditingBid(null);
    }, [activeSection]);

    return (
        <div className={`${activeSection === "lucky" ? "bg-[#7F0000]" : "bg-[#ff9595]"
            } flex flex-col items-center justify-center md:py-20 py-12 min-h-screen`}>
            <div className="flex md:flex-row flex-col items-center  w-full justify-between max-w-6xl pt-15 pb-5">
                <h1 className="text-white text-[32px] md:text-[48px] leading-[100%] mb-8 text-center  px-4">
                    Launch Your {activeSection === "lucky" ? "Lucky Draw" : "Jackpot"} Bid Here!
                </h1>
                <div className="border-2 border-primary rounded-full overflow-hidden shadow-lg flex p-1 bg-white">
                    <button
                        onClick={() => setActiveSection("lucky")}
                        className={`font-bold px-6 py-2 text-lg transition-all duration-300 ${activeSection === "lucky"
                            ? "bg-primary rounded-full text-white"
                            : "bg-white text-primary"
                            }`}
                    >
                        Lucky Draw
                    </button>
                    <button
                        onClick={() => setActiveSection("jackpot")}
                        className={`font-bold px-6 py-2 text-lg transition-all duration-300 ${activeSection === "jackpot"
                            ? "bg-primary rounded-full text-white"
                            : "bg-white text-primary"
                            }`}
                    >
                        Jackpot
                    </button>
                </div>

            </div>

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
                                    if (selectedDate && isDateInRange(selectedDate)) {
                                        setDate(selectedDate)
                                        setOpen(false)
                                    }
                                }}
                                disabled={(date) => !isDateInRange(date)}
                                fromDate={new Date()}
                                toDate={new Date(new Date().setDate(new Date().getDate() + 7))}
                            />
                        </PopoverContent>
                    </Popover>

                    <div className="flex flex-row gap-4 flex-wrap justify-center md:justify-end">
                        {TIME_SLOT.map((slot) => {
                            const disabled = isTimeSlotDisabled(slot.time)
                            return (
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
                                        // style={{
                                        //     clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)",
                                        // }}
                                        variant="outline"
                                        onClick={() => !disabled && setSelectedTime(slot.time)}
                                        disabled={disabled}
                                        className={`justify-center rounded-md text-primary font-regular text-base md:text-lg py-5 px-4 md:px-6  transition-colors border-none select-none
                                            ${disabled
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                                                : selectedTime === slot.time
                                                    ? "bg-primary text-white hover:bg-primary/90 hover:text-white"
                                                    : "bg-white hover:bg-primary hover:text-white"
                                            }`}
                                    >
                                        {slot.time}
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Make a bid  */}
                <div className="flex flex-col items-start justify-center gap-3 bg-white rounded-[22px] max-w-6xl w-full py-5 px-6 mx-auto">
                    <h1 className="text-black text-[20px] md:text-[22px] text-left font-semibold">
                        {editingBid ? `Edit ${activeSection === "lucky" ? "Lucky Draw" : "Jackpot"} Bid` : `Make a ${activeSection === "lucky" ? "Lucky Draw" : "Jackpot"} Bid`}
                    </h1>
                    {activeSection === "lucky" ? (
                        <LuckyDrawBidForm
                            formData={luckyDrawFormData}
                            errors={errors}
                            handleInputChange={handleInputChange}
                            handleSubmit={handleSubmit}
                            loading={loading}
                            editingBid={editingBid}
                        />
                    ) : (
                        <JackpotBidForm
                            formData={{
                                customerName: jackpotFormData.customerName,
                                customerPhone: jackpotFormData.customerPhone,
                                bidNumber: jackpotFormData.bidNumber
                            }}
                            errors={errors}
                            handleInputChange={handleInputChange}
                            handleSubmit={handleSubmit}
                            loading={loading}
                            editingBid={editingBid}
                        />
                    )}
                    {activeSection === "lucky" && (
                        <div className="max-w-4xl w-full flex items-end justify-end text-end text-sm md:text-base">
                            Available count:{" "}
                            <span className="ml-1 font-semibold">
                                {luckyDrawFormData.bidNumber ? getAvailableCount(parseInt(luckyDrawFormData.bidNumber)) : 80}
                            </span>
                        </div>
                    )}
                </div>

                {/* Bid chart */}
                <div className="flex flex-col items-start justify-center gap-3 bg-white rounded-[22px] max-w-6xl w-full py-5 px-6 mx-auto">
                    <div className="flex flex-row w-full items-center">
                        <h1 className="text-black text-[20px] md:text-[22px] text-left font-semibold">{activeSection === "lucky" ? "Lucky Draw" : "Jackpot"} Bid Cart</h1>
                    </div>
                    {activeSection === "lucky" ? (
                        <LuckyDrawBidCart
                            filteredBids={filteredBids as any}
                            editingBid={editingBid}
                            totalAmount={totalAmount}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    ) : (
                        <JackpotBidCart
                            filteredBids={filteredBids as any}
                            editingBid={editingBid}
                            totalAmount={totalAmount}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    )}
                </div>

                {/* Clear and submit bid button */}
                <div className="flex flex-row items-center justify-between gap-3 rounded-[22px] max-w-6xl w-full py-2 px-6 mx-auto">
                    <button
                        onClick={() => filteredBids.length > 0 && setConfirmDialog({ open: true, type: 'clear' })}
                        disabled={filteredBids.length === 0}
                        // style={{
                        //     clipPath: "polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                        // }}
                        className="bg-white rounded-full text-primary flex flex-row items-center gap-2 px-4 md:px-5 py-2 text-sm md:text-base hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Clear all <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button
                        onClick={() => filteredBids.length > 0 && setConfirmDialog({ open: true, type: 'submit' })}
                        disabled={filteredBids.length === 0}
                        // style={{
                        //     clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
                        // }}
                        className="bg-primary rounded-full text-white px-4 md:px-5 py-2 text-sm md:text-base hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirm {activeSection === "lucky" ? "Lucky Draw" : "Jackpot"} Bid
                    </button>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ open, type: null })}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {confirmDialog.type === 'clear' ? `Clear All ${activeSection === "lucky" ? "Lucky Draw" : "Jackpot"} Bids` : `Confirm ${activeSection === "lucky" ? "Lucky Draw" : "Jackpot"} Bids`}
                        </DialogTitle>
                        <DialogDescription>
                            {confirmDialog.type === 'clear'
                                ? `Are you sure you want to clear all ${activeSection === "lucky" ? "Lucky Draw" : "Jackpot"} bids for ${date?.toLocaleDateString()} at ${selectedTime}? This action cannot be undone.`
                                : `Are you sure you want to confirm ${filteredBids.length} ${activeSection === "lucky" ? "Lucky Draw" : "Jackpot"} bid(s) with a total amount of RM ${totalAmount}?`
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setConfirmDialog({ open: false, type: null })}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDialog.type === 'clear' ? handleClearAll : handleConfirmBid}
                            className={confirmDialog.type === 'clear' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90'}
                        >
                            {confirmDialog.type === 'clear' ? 'Clear All' : 'Confirm'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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