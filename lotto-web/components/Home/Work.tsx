import React from 'react'
import { Agent, Coins, LottoMachineRed, Pool } from '../Reusable/Images'
import Image from 'next/image'
import type { StaticImageData } from 'next/image'

// Types
interface WorkContent {
  title: string
  desc: string
  img: StaticImageData
  bgColor: string
  gridArea: string
  textColor: 'white' | 'black'
}

// Constants
const WORK_CONTENTS: readonly WorkContent[] = [
  {
    title: 'Contact an Agent',
    desc: 'Contact an authorized agent to place your bids securely and get guidance.',
    img: Agent,
    bgColor: '#C54C4C',
    gridArea: '1 / 1 / 3 / 5',
    textColor: 'white',
  },
  {
    title: 'Choose Your Number',
    desc: 'Select any number between 0 and 32. Each number can receive a total of 80 bids only.',
    img: Pool,
    bgColor: '#FF6B6B',
    gridArea: '3 / 1 / 5 / 3',
    textColor: 'white',
  },
  {
    title: 'Place Your Bids',
    desc: 'You can bid up to 80 times on a single number. Once all 80 bids for a number are taken, no further bids can be placed on it.',
    img: Coins,
    bgColor: '#FFE5E5',
    gridArea: '3 / 3 / 5 / 5',
    textColor: 'black',
  },
  {
    title: 'Wait for the Draw',
    desc: 'When the winning number is drawn, everyone who placed a bid on that number wins.',
    img: LottoMachineRed,
    bgColor: '#8B0000',
    gridArea: '1 / 5 / 5 / 12',
    textColor: 'white',
  }
] as const

// Card Components
const ContactAgentCard: React.FC<WorkContent> = ({ title, desc, img, bgColor, gridArea, textColor }) => (
  <div
    className="rounded-2xl p-6 flex flex-row items-center justify-between transition-transform duration-300 hover:scale-[1.02] h-[277px] overflow-hidden relative w-full"
    style={{ backgroundColor: bgColor, gridArea }}
  >
    <div className="flex flex-col justify-between h-full z-10 flex-1 pr-8 py-5">
      <h2 className={`heading text-xl md:text-[36px] mb-3 ${textColor === 'white' ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h2>
      <p className={`md:text-[16px] md:leading-[19px] ${textColor === 'white' ? 'text-white/90' : 'text-gray-700'}`}>
        {desc}
      </p>
    </div>
    <div className="shrink-0 flex justify-end items-center w-[50%]">
      <Image
        src={img}
        alt={title}
        width={1000}
        height={1000}
        className="w-full max-w-7xl h-[450px] object-cover mt-20 translate-x-8"
        priority
      />
    </div>
  </div>
)

const ChooseNumberCard: React.FC<WorkContent> = ({ title, desc, img, bgColor, gridArea, textColor }) => (
  <div
    className="rounded-2xl p-5 flex flex-col transition-transform duration-300 hover:scale-[1.02] h-[303px] mt-3 overflow-hidden relative"
    style={{ backgroundColor: bgColor, gridArea }}
  >
    <div className="flex flex-col z-10">
      <h2 className={`heading text-xl md:text-[36px] mb-2 ${textColor === 'white' ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h2>
    </div>
    <div className="absolute inset-0 -right-15 flex items-start justify-end z-5">
      <Image
        src={img}
        alt={title}
        width={1000}
        height={1000}
        className="w-[90%] h-auto object-cover"
      />
    </div>
    <p className={`md:text-[16px] md:leading-[19px] mt-auto ${textColor === 'white' ? 'text-white' : 'text-gray-700'}`}>
      {desc}
    </p>
  </div>
)

const PlaceBidsCard: React.FC<WorkContent> = ({ title, desc, img, bgColor, gridArea, textColor }) => (
  <div
    className="rounded-2xl px-4 py-2 flex flex-col transition-transform duration-300 hover:scale-[1.02] mt-3 h-[303px] overflow-hidden relative"
    style={{ backgroundColor: bgColor, gridArea }}
  >
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 w-[50%]">
      <Image
        src={img}
        alt={title}
        width={500}
        height={500}
        className="w-full h-auto object-contain"
      />
    </div>
    <div className="flex flex-col z-10 mt-auto">
      <h2 className={`heading text-xl md:text-[36px] mb-2 ${textColor === 'white' ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h2>
      <p className={`md:text-[16px] md:leading-[19px] ${textColor === 'white' ? 'text-white' : 'text-gray-700'}`}>
        {desc}
      </p>
    </div>
  </div>
)

const WaitForDrawCard: React.FC<WorkContent> = ({ title, desc, img, bgColor, gridArea, textColor }) => (
  <div
    className="rounded-2xl p-6 flex flex-col transition-transform duration-300 hover:scale-[1.02] h-[590px] overflow-hidden relative"
    style={{ backgroundColor: bgColor, gridArea }}
  >
    <div className="flex flex-col z-10">
      <h2 className={`heading text-xl md:text-[36px] mb-3 ${textColor === 'white' ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h2>
      <p className={`md:text-[16px] md:leading-[19px] ${textColor === 'white' ? 'text-white' : 'text-gray-700'}`}>
        {desc}
      </p>
    </div>
    <div className="flex-1 flex items-end justify-center mt-4">
      <Image
        src={img}
        alt={title}
        width={1000}
        height={1000}
        className="w-[650px] h-auto object-contain"
      />
    </div>
  </div>
)

const MobileCard: React.FC<WorkContent & { index: number }> = ({ title, desc, img, bgColor, textColor, index }) => {
  // Different layouts for different cards
  const isContactAgent = index === 0
  const isChooseNumber = index === 1
  const isPlaceBids = index === 2
  const isWaitForDraw = index === 3

  if (isContactAgent) {
    return (
      <div
        className="rounded-2xl p-6 flex flex-col transition-transform duration-300 active:scale-[0.98] overflow-hidden relative min-h-[320px] sm:min-h-[360px]"
        style={{ backgroundColor: bgColor }}
      >
        <div className="flex flex-col z-10 mb-4">
          <h2 className={`heading text-2xl sm:text-3xl mb-3 ${textColor === 'white' ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${textColor === 'white' ? 'text-white/90' : 'text-gray-700'}`}>
            {desc}
          </p>
        </div>
        <div className="flex-1 flex items-end justify-center">
          <Image
            src={img}
            alt={title}
            width={600}
            height={600}
            className="w-full max-w-[280px] sm:max-w-[320px] h-auto object-contain"
          />
        </div>
      </div>
    )
  }

  if (isChooseNumber) {
    return (
      <div
        className="rounded-2xl p-6 flex flex-col transition-transform duration-300 active:scale-[0.98] overflow-hidden relative min-h-[340px] sm:min-h-[380px]"
        style={{ backgroundColor: bgColor }}
      >
        <div className="flex flex-col z-10 relative">
          <h2 className={`heading text-2xl sm:text-3xl mb-3 ${textColor === 'white' ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h2>
        </div>
        <div className="absolute top-12 right-0 w-[65%] sm:w-[60%] h-[200px] sm:h-[240px] z-5">
          <Image
            src={img}
            alt={title}
            width={800}
            height={800}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-auto z-10 pt-4">
          <p className={`text-sm sm:text-base leading-relaxed ${textColor === 'white' ? 'text-white/90' : 'text-gray-700'}`}>
            {desc}
          </p>
        </div>
      </div>
    )
  }

  if (isPlaceBids) {
    return (
      <div
        className="rounded-2xl p-6 flex flex-col transition-transform duration-300 active:scale-[0.98] overflow-hidden relative min-h-[340px] sm:min-h-[380px]"
        style={{ backgroundColor: bgColor }}
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[55%] sm:w-[50%] z-5">
          <Image
            src={img}
            alt={title}
            width={600}
            height={600}
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="flex flex-col z-10 mt-auto">
          <h2 className={`heading text-2xl sm:text-3xl mb-3 ${textColor === 'white' ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${textColor === 'white' ? 'text-white/90' : 'text-gray-700'}`}>
            {desc}
          </p>
        </div>
      </div>
    )
  }

  if (isWaitForDraw) {
    return (
      <div
        className="rounded-2xl p-6 flex flex-col transition-transform duration-300 active:scale-[0.98] overflow-hidden relative min-h-[400px] sm:min-h-[440px]"
        style={{ backgroundColor: bgColor }}
      >
        <div className="flex flex-col z-10">
          <h2 className={`heading text-2xl sm:text-3xl mb-3 ${textColor === 'white' ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${textColor === 'white' ? 'text-white/90' : 'text-gray-700'}`}>
            {desc}
          </p>
        </div>
        <div className="flex-1 flex items-end justify-center mt-6">
          <Image
            src={img}
            alt={title}
            width={800}
            height={800}
            className="w-full max-w-[300px] sm:max-w-[350px] h-auto object-contain"
          />
        </div>
      </div>
    )
  }

  return null
}

// Card renderer mapping
const CARD_COMPONENTS = [
  ContactAgentCard,
  ChooseNumberCard,
  PlaceBidsCard,
  WaitForDrawCard,
] as const

// Main Component
const Work: React.FC = () => {
  return (
    <div className="w-full py-8 md:py-20 px-4 md:px-0">
      <h1 className="heading text-3xl md:text-4xl lg:text-5xl text-center mb-8 md:mb-12">
        How Lucky Draw will <span className="text-primary">Work?</span>
      </h1>

      {/* Desktop Layout */}
      <div className="hidden lg:grid grid-cols-5 grid-rows-4 gap-6 w-full h-[550px]">
        {WORK_CONTENTS.map((content, idx) => {
          const CardComponent = CARD_COMPONENTS[idx]
          return <CardComponent key={content.title} {...content} />
        })}
      </div>

      {/* Mobile Layout */}
      <div className="flex lg:hidden flex-col gap-4 w-full">
        {WORK_CONTENTS.map((content, idx) => (
          <MobileCard key={content.title} {...content} index={idx} />
        ))}
      </div>
    </div>
  )
}

export default Work