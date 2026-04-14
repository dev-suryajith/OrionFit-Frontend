import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import DashboardTab from '../components/DashboardTab'
import WaterLog from '../components/WaterLog'
import WorkoutLog from '../components/WorkoutLog'
import FoodLog from '../components/FoodLog'
import { Menu } from 'lucide-react'
import { useEffect } from 'react'
import AITrainer from '../components/AITrainer'

function Dashboard() {

  const [currentTab, setCurrentTab] = useState('dashboard')
  const [open, setOpen] = useState(false) // 👈 closed by default on mobile

  const renderTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardTab />
      case 'water':
        return <WaterLog />
      case 'workout':
        return <WorkoutLog />
      case 'diet':
        return <FoodLog />
      case 'trainer':
        return <AITrainer />
      case 'settings':
        return <div>Settings</div>
      default:
        return <div>Not Found</div>
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 500) {
        setOpen(true)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="flex min-h-screen bg-[#1b1b1b] text-white">

      {/* 🔥 MOBILE SIDEBAR OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
        />
      )}

      {/* 🔥 SIDEBAR */}
      <div className={`
        fixed sm:static top-0 left-0 h-full z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        sm:translate-x-0
      `}>
        <Sidebar
          setCurrentTab={(tab) => {
            setCurrentTab(tab)
            window.innerWidth < 500 && setOpen(false)
          }}
          open={open}
          setOpen={setOpen}
        />
      </div>

      {/* 🔥 MAIN CONTENT */}
      <div className="flex-1 flex flex-col w-full">

        {/* TOP BAR (MOBILE) */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 sm:hidden">
          <button onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-semibold capitalize">
            {currentTab}
          </h1>
          <div /> {/* spacing */}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 p-3 sm:p-6 overflow-y-auto">

          <div className="
            bg-[#1f1f1f] 
            border border-white/10 
            rounded-xl 
            p-3 sm:p-6 
            min-h-full
          ">
            {renderTab()}
          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard