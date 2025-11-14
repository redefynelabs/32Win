"use client";
import { Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { LotteryMachine } from "./LotteryMachine";
import { BgShapes } from "../Reusable/Images";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getNextDrawTime } from "../Reusable/GetTime";
import { TIME_SLOT } from "@/constants/Time";

const MakeaBid = () => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<number>(0);
  const [winnerNumber, setWinnerNumber] = useState<string>("?");
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentDate = String(new Date().getDate()).padStart(2, '0');

  // Find current active time slot based on current time
  useEffect(() => {
    const findCurrentSlot = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentMinutes = currentHour * 60 + currentMinute;

      let activeSlot = 0;

      for (let i = 0; i < TIME_SLOT.length; i++) {
        const slotTime = TIME_SLOT[i].time;
        const [time, period] = slotTime.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        // Convert to 24-hour format
        if (period === 'PM' && hours !== 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }

        const slotMinutes = hours * 60 + minutes;

        // If current time is past this slot, this could be active
        if (currentMinutes >= slotMinutes) {
          activeSlot = i;
        }
      }

      setSelectedSlot(activeSlot);
    };

    findCurrentSlot();
    const interval = setInterval(findCurrentSlot, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const nextDraw = getNextDrawTime();
      const diffMs = nextDraw.getTime() - new Date().getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if selected time slot is in the past
  useEffect(() => {
    const checkTimeSlot = () => {
      if (selectedSlot === null) return;

      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const slotTime = TIME_SLOT[selectedSlot].time;
      const [time, period] = slotTime.split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      // Convert to 24-hour format
      if (period === 'PM' && hours !== 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }

      const slotMinutes = hours * 60 + minutes;
      const currentMinutes = currentHour * 60 + currentMinute;

      // If slot time has passed, show random number (0-32)
      if (currentMinutes > slotMinutes) {
        // Generate consistent random number based on date and slot
        const seed = new Date().getDate() * 1000 + selectedSlot;
        const randomNum = seed % 33; // Ensures 0-32
        setWinnerNumber(randomNum.toString().padStart(2, '0'));
      } else {
        // Future time - show question mark
        setWinnerNumber("?");
      }
    };

    checkTimeSlot();
    const interval = setInterval(checkTimeSlot, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [selectedSlot]);

  const handleSlotClick = (index: number) => {
    setSelectedSlot(index);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* 3D model area */}
      <div className="w-full lg:w-[40%] h-[40vh] md:h-screen flex items-center justify-center">
        <Canvas
          shadows
          camera={{ position: [0, 0, 3], fov: 25 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
          <LotteryMachine />
          <Preload all />
        </Canvas>
      </div>

      {/* Text/content area */}
      <div
        className="w-full lg:w-[60%] flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-0 xl:py-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BgShapes.src})` }}
      >
        <div className="relative p-4 sm:p-5 md:p-6 lg:p-7 w-full border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-0">
            {/* Left Section: Date */}
            <div className="w-full lg:w-auto">
              <h1 className="text-2xl sm:text-3xl md:text-[37px] font-regular">{currentMonth}</h1>
              <p className="text-6xl sm:text-7xl md:text-8xl lg:text-[122px] text-[#FF5959] leading-none">{currentDate}</p>

              <div className="flex flex-col mt-2 md:mt-0">
                <h1 className="text-black/50 leading-6 text-sm sm:text-base">Draw Result in</h1>
                <p className="text-xl sm:text-2xl md:text-3xl leading-[130%] font-regular text-black/50 mt-2">{timeLeft}</p>
              </div>
            </div>

            {/* Right Section: Time Slots + Button */}
            <div className="flex flex-col w-full lg:w-[60%] justify-between gap-6">
              {/* Grid for 4 Time Slots */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-7">
                {TIME_SLOT.map((time, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlotClick(index)}
                    // style={{
                    //   clipPath:
                    //     "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
                    // }}
                    className={`text-sm rounded-[8px] sm:text-base md:text-lg lg:text-[20px] px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 font-regular transition-colors duration-300 ${selectedSlot === index
                        ? "bg-primary text-white"
                        : "text-primary bg-white hover:bg-primary hover:text-white"
                      }`}
                  >
                    {time.time}
                  </button>
                ))}
              </div>

              {/* Full-width Button */}
              <Link
                href="/login"
                // style={{
                //   clipPath:
                //     "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)",
                // }}
                className="block w-full text-center bg-primary text-white text-base sm:text-lg md:text-xl lg:text-[21px] rounded-full font-regular py-2.5 sm:py-3 hover:bg-thunderbird-800 transition-colors duration-300"
              >
                Make a Bid
              </Link>
            </div>
          </div>
        </div>

        <div
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 100% 70%, calc(100% - 30px) 100%, 0 100%)",
          }}
          className="relative flex flex-col w-full sm:w-72 md:w-[60%] h-auto min-h-[120px] sm:min-h-[130px] md:h-[14vh] bg-primary/10 backdrop-blur-xl shadow] mt-5 p-4 sm:p-5 md:px-6 lg:px-7 border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg"
        >
          <h1 className="text-black text-2xl sm:text-3xl md:text-[36px] leading-tight">Winner</h1>
          <span className="text-6xl sm:text-7xl md:text-8xl lg:text-[65px] text-[#FF5959] leading-none">{winnerNumber}</span>
        </div>
      </div>
    </div>
  );
};

export default MakeaBid;