import React, { useEffect, useState } from 'react'
import { Mail, Target, Activity, Ruler, Weight } from 'lucide-react'

function Settings() {

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    age: "",
    height: "",
    weight: "",
    goal: "",
    calorieIntake: ""
  })

  // ✅ Load from localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('existingUser'))

    if (data) {
      setUserData({
        name: data.username || "",
        email: data.email || "",
        age: data.age || "",
        height: data.height || "",
        weight: data.weight || "",
        goal: data.goal || "",
        calorieIntake: data.calorieIntake || ""
      })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("existingUser")
    window.location.reload()
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

      {/* HEADER */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-semibold text-white">Settings</h2>
        <p className="text-white/40 text-sm">Manage your profile & fitness data</p>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-linear-to-br from-white/10 to-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-5 shadow-lg backdrop-blur">

        <div className="w-16 h-16 rounded-full bg-[#90c21d] flex items-center justify-center text-black text-xl font-bold">
          {userData.name?.[0] || "U"}
        </div>

        <div>
          <p className="text-white text-lg font-medium">{userData.name || "User"}</p>
          <p className="text-white/50 text-sm flex items-center gap-2">
            <Mail size={14} /> {userData.email || "No email"}
          </p>
        </div>

      </div>

      {/* BODY STATS */}
      <div className="grid md:grid-cols-2 gap-5">

        <div className="card">
          <Activity className="icon" />
          <div>
            <p className="label">Age</p>
            <p className="value">{userData.age} yrs</p>
          </div>
        </div>

        <div className="card">
          <Ruler className="icon" />
          <div>
            <p className="label">Height</p>
            <p className="value">{userData.height} cm</p>
          </div>
        </div>

        <div className="card">
          <Weight className="icon" />
          <div>
            <p className="label">Weight</p>
            <p className="value">{userData.weight} kg</p>
          </div>
        </div>

        <div className="card">
          <Target className="icon" />
          <div>
            <p className="label">Goal</p>
            <p className="value">{userData.goal}</p>
          </div>
        </div>

      </div>

      {/* CALORIE CARD */}
      <div className="bg-gradient-to-r from-[#90c21d]/20 to-[#90c21d]/5 border border-[#90c21d]/30 p-6 rounded-2xl shadow-md">

        <p className="text-white/60 text-sm mb-1">Daily Calorie Target</p>
        <p className="text-3xl font-semibold text-[#90c21d]">
          {userData.calorieIntake} kcal
        </p>

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">

        <button className="flex-1 bg-[#90c21d] hover:scale-[1.02] transition py-3 rounded-xl text-black font-medium shadow-md">
          Edit Profile
        </button>

        <button
          onClick={handleLogout}
          className="flex-1 bg-red-500/80 hover:bg-red-500 transition py-3 rounded-xl text-white font-medium shadow-md">
          Logout
        </button>

      </div>

      {/* REUSABLE STYLES */}
      <style>
        {`
          .card {
            display: flex;
            align-items: center;
            gap: 14px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            padding: 16px;
            border-radius: 14px;
            transition: 0.2s ease;
          }

          .card:hover {
            background: rgba(255,255,255,0.08);
          }

          .icon {
            color: #90c21d;
          }

          .label {
            font-size: 12px;
            color: rgba(255,255,255,0.5);
          }

          .value {
            font-size: 16px;
            color: white;
            font-weight: 500;
          }
        `}
      </style>

    </div>
  )
}

export default Settings