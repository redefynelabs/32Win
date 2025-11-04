"use client";
import { Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { LotteryMachine } from "./LotteryMachine";
import { BgShapes } from "../Reusable/Images";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getNextDrawTime } from "../Reusable/GetTime";
import { TIME_SLOT } from "@/Constants/Time";

const MakeaBid = () => {
  const [timeLeft, setTimeLeft] = useState("");
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentDate = String(new Date().getDate()).padStart(2, '0');

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

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 3D model area */}
      <div className="w-full md:w-[40%] h-[40vh] md:h-screen flex items-center justify-center">
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
        className="w-full md:w-[60%] flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-0 bg-cover bg-center bg-no-repeat"
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
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
                    }}
                    className="text-sm sm:text-base md:text-lg lg:text-[20px] text-primary bg-white hover:bg-primary hover:text-white px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 font-regular transition-colors duration-300"
                  >
                    {time.time}
                  </button>
                ))}
              </div>

              {/* Full-width Button */}
              <Link
                href="/login"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)",
                }}
                className="block w-full text-center bg-primary text-white text-base sm:text-lg md:text-xl lg:text-[21px] font-regular py-2.5 sm:py-3 hover:bg-thunderbird-800 transition-colors duration-300"
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
          className="relative flex flex-col w-full sm:w-72 md:w-80 h-auto min-h-[120px] sm:min-h-[130px] md:h-[136px] mt-5 p-4 sm:p-5 md:p-6 lg:p-7 border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg"
        >
          <h1 className="text-black text-2xl sm:text-3xl md:text-[36px] leading-tight">Winner</h1>
          <span className="text-6xl sm:text-7xl md:text-8xl lg:text-[95px] text-[#FF5959] leading-none">?</span>
        </div>
      </div>
    </div>
  );
};

export default MakeaBid;