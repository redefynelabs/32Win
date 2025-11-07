"use client";
import { JACKOPT_WINNER } from "@/components/Data/Jackpot_winner";
import { winners_data } from "@/components/Data/Winner_data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { CelebrationBanner } from "@/components/Reusable/Images";
import Confetti from "@/components/Reusable/Confetti";

const Page = () => {
  const [activeSection, setActiveSection] = useState("lucky");
  const today = new Date()
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(",", "");
  const sessions = ["Morning", "Afternoon", "Evening", "Night"];
  const currentData = winners_data.find((item) => item.date === today);
  const currentJackpotData = JACKOPT_WINNER.find((item) => item.date === today);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [openJackpot, setOpenJackpot] = useState(false);
  const [dateJackpot, setDateJackpot] = useState<Date | undefined>(undefined);


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
            <div className="bg-primary p-8 overflow-y-auto mt-2 shadow-lg rounded-md h-[400px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-primary/30 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-white/80">
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
        ) : (
          // jackpot
          <>
            <div className="bg-primary  p-8  shadow-lg rounded-md ">
              <div className="flex  flex-row justify-between ">
                <h1 className="text-white text-[24px]">Today's Winners</h1>
                <p className="text-white text-[20px]">{today}</p>
              </div>

              <div className="grid md:grid-cols-6 grid-cols-3 gap-9 w-full max-w-lg mx-auto mt-10">
                {currentJackpotData?.slots.map((slot, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col gap-3 items-center"
                    >
                      <div className="bg-white rounded-full shadow-md border-2 border-primary w-18 h-18  flex items-center justify-center text-primary font-bold text-4xl hover:scale-105">
                        {slot?.bid_number ? slot.bid_number : "?"}
                      </div>

                    </div>
                  );
                }) || (
                    <p className="text-white col-span-3">No winners for today</p>
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
            <div className="bg-primary p-8 overflow-y-auto mt-2 shadow-lg rounded-md h-[400px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-primary/30 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-white/80">
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
        )}
      </div>
    </div>
  );
};

export default Page;