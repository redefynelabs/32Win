"use client";

import { winners_data } from "@/components/Data/Winner_data";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface LuckyDrawResultsProps {
  today: string;
}

export const LuckyDrawResults = ({ today }: LuckyDrawResultsProps) => {
  const sessions = ["Morning", "Afternoon", "Evening", "Night"];
  const currentData = winners_data.find((item) => item.date === today);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <>
      <div className="bg-primary  p-8  shadow-lg rounded-md ">
        <div className="flex  flex-row justify-between ">
          <h1 className="text-white text-[24px]">Today's Winners</h1>
          <p className="text-white text-[20px]">{today}</p>
        </div>

        <div className="grid md:grid-cols-4 grid-cols-2 w-full gap-8 md:max-w-md max-w-sm mx-auto mt-10">
          {sessions.map((session, index) => {
            const slot = currentData?.slots.find(
              (s) => s.session === session
            );
            return (
              <div
                key={index}
                className="flex flex-col gap-3 items-center"
              >
                <div className="bg-white rounded-full shadow-md border-2 border-primary w-18 h-18  flex items-center justify-center text-primary font-bold text-4xl hover:scale-105">
                  {slot?.bid_number ? slot.bid_number : "?"}
                </div>
                <span className=" text-white text-xl font-medium">
                  {session}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-row mt-5 items-center justify-between w-full">
        <h1 className="text-lg">Previous Results</h1>
        <div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-auto justify-between border-[#7F0000] text-primary font-regular text-md   rounded-md hover:bg-primary/10 transition-colors"
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
                  setDate(selectedDate);
                  setOpen(false);
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
          const selectedDateStr = date
            ? date
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                .replace(",", "")
            : null;

          // Sort data: selected date first, then all others in reverse chronological order
          const sortedData = [...winners_data].sort((a, b) => {
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
              {sortedData.map((dataItem, dataIndex) => (
                <div key={dataIndex} className="flex flex-col gap-4">
                  {sessions.map((session, sessionIndex) => {
                    const slot = dataItem.slots.find(
                      (s) => s.session === session
                    );
                    return (
                      <div
                        key={sessionIndex}
                        className="flex flex-row items-center justify-between w-full border-b py-2"
                      >
                        {/* Left side - Date and Session */}
                        <div className="flex flex-col items-start">
                          <span className="text-white text-lg font-semibold">
                            {dataItem.date}
                          </span>
                          <span className="text-white/80 text-lg">
                            {session}
                          </span>
                        </div>

                        {/* Right side - Bid Number */}
                        <div className="bg-white rounded-full shadow-md border-2 border-primary w-12 h-12 flex items-center justify-center text-primary font-bold text-xl hover:scale-105 transition-transform">
                          {slot?.bid_number ? slot.bid_number : "?"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </>
  );
};