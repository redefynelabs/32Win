"use client";
import { useState } from "react";
import Image from "next/image";
import { CelebrationBanner } from "@/components/Reusable/Images";
import Confetti from "@/components/Reusable/Confetti";
import { LuckyDrawResults } from "@/components/Results/LuckyDrawResults";
import { JackpotResults } from "@/components/Results/JackpotResults";

const Page = () => {
  const [activeSection, setActiveSection] = useState("lucky");
  const today = new Date()
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(",", "");

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#FFFAF4] pt-40  p-6">
      <Image src={CelebrationBanner} alt="banner" className="absolute  w-[35%] top-14 right-0  rotate-8 transform scale-x-[-1]" />
      <Image src={CelebrationBanner} alt="banner" className="absolute w-[35%] top-14 left-0  -rotate-8" />
      <Confetti />
      {/* Toggle Button */}
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

      {/* Section Content */}
      <div className="mt-10 w-full max-w-2xl  text-center">
        {activeSection === "lucky" ? (
          <LuckyDrawResults today={today} />
        ) : (
          <JackpotResults today={today} />
        )}
      </div>
    </div>
  );
};

export default Page;