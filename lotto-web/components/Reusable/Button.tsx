"use client";
import Image from "next/image";
import buttonStar from "@/assets/Home/buttonStar.svg";

export default function MakeBidButton() {
  return (
    <div className="flex items-center justify-center pt-15 ">
      {/* Glowing red outer aura */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-3xl bg-red-600/80 opacity-10 animate-pulse"></div>

        <div className="flex border border-primary rounded-full px-1.5   my-1 ">
          <div className="flex border border-primary rounded-full px-1.5   my-1 ">

            {/* Main Button */}
            <button className="relative px-14 py-5 my-1 rounded-full border border-white/80 bg-[#e70000] text-white font-bold text-3xl tracking-wide flex items-center justify-center transition-all duration-300  active:scale-95 shadow-[0_0_60px_10px_rgba(255,0,0,0.7)] overflow-hidden">
              {/* Extended red glow beneath border */}
              <div className="absolute -inset-x-4 -bottom-6 h-10 rounded-full blur-3xl bg-red-600/70 opacity-70"></div>

              {/* Inner gradient shine */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full opacity-60"></div>

              {/* Text */}
              <span className="relative z-10 ">Make a Bid</span>

              {/* Sparkles */}
              <div className="absolute left-6 top-3 animate-sparkle">
                <Image src={buttonStar} alt="star" width={18} height={18} />
              </div>
              <div className="absolute left-10 bottom-3 animate-sparkle delay-1000">
                <Image src={buttonStar} alt="star" width={16} height={16} />
              </div>
              <div className="absolute right-6 top-3 animate-sparkle delay-500">
                <Image src={buttonStar} alt="star" width={18} height={18} />
              </div>
            </button>


          </div>
        </div>


      </div>
    </div>
  );
}
