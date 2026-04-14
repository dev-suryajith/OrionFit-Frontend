import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdOutlineDashboard } from "react-icons/md";
import { PiForkKnifeBold } from "react-icons/pi";
import { LuDumbbell } from "react-icons/lu";
import { FaGlassWaterDroplet } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import logo from '../assets/logo/OrionFit-Logo.png'

function Sidebar({ setCurrentTab, setOpen, open }) {

    // const [open, setOpen] = useState(true)
    const [active, setActive] = useState("dashboard")

    const menu = [
        { id: "dashboard", label: "Dashboard", icon: <MdOutlineDashboard /> },
        { id: "workout", label: "Workout Logger", icon: <LuDumbbell /> },
        { id: "diet", label: "Food Logger", icon: <PiForkKnifeBold /> },
        { id: "water", label: "Water Logger", icon: <FaGlassWaterDroplet /> },
        { id: "settings", label: "Settings", icon: <IoSettings /> },
    ]

    return (
        <div className="flex ">

            {/* Sidebar */}
            <motion.div
                animate={{ width: open ? 220 : 70 }}
                className="h-[99ch] overflow-y-hidden bg-[#1f1f1f] border-r border-white/10 p-3 flex flex-col sticky top-0"
            >

                {/* Toggle */}
                {open && <div className="mb-6 py-6 text-3xl text-white/60 border-b border-white/10 hover:text-white flex justify-center">
                    <img src={logo} alt="" className='w-25' /> 
                </div>}

                {/* Menu */}
                <div className="flex flex-col gap-2">

                    {menu.map(item => (
                        <button
                            key={item.id}
                            onClick={() => (setActive(item.id), setCurrentTab(item.id))}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all 
                            ${active === item.id
                                    ? "bg-[#91ff00]/20 text-[#91ff00]"
                                    : "text-white/60 hover:bg-white/10 hover:text-white"}`}
                        >
                            {/* Icon placeholder */}
                            <span className="text-lg">{item.icon}</span>

                            {open && <span>{item.label}</span>}
                        </button>
                    ))}

                </div>

                {/* Bottom */}
                <div className="mt-auto text-white/40 text-sm">
                    {open && "FitAI v1.0"}
                </div>

            </motion.div>


        </div>
    )
}

export default Sidebar