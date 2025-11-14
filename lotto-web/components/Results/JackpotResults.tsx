"use client";

import { JACKOPT_WINNER } from "@/components/Data/Jackpot_winner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface JackpotResultsProps {
  today: string;
}

export const JackpotResults = ({ today }: JackpotResultsProps) => {
  const currentJackpotData = JACKOPT_WINNER.find((item) => item.date === today);
  const [openJackpot, setOpenJackpot] = useState(false);
  const [dateJackpot, setDateJackpot] = useState<Date | undefined>(undefined);

  return (
    <>
      <div className="bg-primary  p-8  shadow-lg rounded-md ">
        <div className="flex  flex-row justify-between ">
          <h1 className="text-white text-[24px]">Today's Winners</h1>
          <p className="text-white text-[20px]">{today}</p>
        </div>

        <div className="grid md:grid-cols-6 grid-cols-3 gap-9 w-full max-w-lg mx-auto mt-10">
          {currentJackpotData?.slots && currentJackpotData.slots.length > 0 ? (
            currentJackpotData.slots.map((slot, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 items-center"
              >
                <div className="bg-white rounded-full shadow-md border-2 border-primary w-18 h-18  flex items-center justify-center text-primary font-bold text-4xl hover:scale-105">
                  {slot?.bid_number ? slot.bid_number : "?"}
                </div>
              </div>
            ))
          ) : (
            // Show 6 empty slots with "?" when no data
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 items-center"
              >
                <div className="bg-white rounded-full shadow-md border-2 border-primary w-18 h-18  flex items-center justify-center text-primary font-bold text-4xl hover:scale-105">
                  ?
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex flex-row mt-5 items-center justify-between w-full">
        <h1 className="text-lg">Previous Results</h1>
        <div>
          <Popover open={openJackpot} onOpenChange={setOpenJackpot}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-auto justify-between border-[#7F0000] text-primary font-regular text-md   rounded-md hover:bg-primary/10 transition-colors"
              >
                {dateJackpot ? dateJackpot.toLocaleDateString() : "Select date"}
                <ChevronDown className="h-4 w-4 ml-1 text-primary" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0 rounded-md border border-[#7F0000]/30"
              align="start"
            >
              <Calendar
                mode="single"
                selected={dateJackpot}
                captionLayout="dropdown"
                onSelect={(selectedDate) => {
                  setDateJackpot(selectedDate);
                  setOpenJackpot(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div 
        className="bg-primary p-8 overflow-y-auto mt-2 shadow-lg rounded-md h-[400px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-primary/30 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-white/80"
        data-lenis-prevent
      >
        {(() => {
          const selectedDateStr = dateJackpot
            ? dateJackpot
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                .replace(",", "")
            : null;

          // Sort data: selected date first, then all others in reverse chronological order
          const sortedJackpotData = [...JACKOPT_WINNER].sort((a, b) => {
            if (selectedDateStr) {
              if (a.date === selectedDateStr) return -1;
              if (b.date === selectedDateStr) return 1;
            }
            // Parse dates for comparison
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB.getTime() - dateA.getTime();
          });

          return (
            <div className="flex flex-col gap-6">
              {sortedJackpotData.map((dataItem, dataIndex) => (
                <div key={dataIndex} className="flex flex-col gap-4">
                  {dataItem?.slots?.length > 0 ? (
                    <div className="flex flex-row items-center justify-between w-full border-b py-2">
                      {/* Left side - Date */}
                      <div className="flex flex-col items-start">
                        <span className="text-white text-lg font-semibold">
                          {dataItem.date}
                        </span>
                      </div>

                      {/* Right side - All 6 numbers in a row */}
                      <div className="flex flex-row gap-2">
                        {dataItem.slots.map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            className="bg-white rounded-full shadow-md border-2 border-primary w-12 h-12 flex items-center justify-center text-primary font-bold text-xl hover:scale-105 transition-transform"
                          >
                            {slot?.bid_number ?? "?"}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center justify-between w-full border-b py-2">
                      <div className="flex flex-col items-start">
                        <span className="text-white text-lg font-semibold">
                          {dataItem.date}
                        </span>
                      </div>
                      <span className="text-white/80">No results</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </>
  );
};