import React from 'react'

function DashboardTab() {
  const existingUser = JSON.parse(localStorage.getItem('existingUser'))
  return (
    <div className="p-4 sm:p-6 text-white space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Good afternoon
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Here's your daily summary
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Calories */}
        <div className="bg-[#1f1f1f] border border-white/10 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-yellow-400">🔥</span>
            <span className="text-white/40 text-sm">0%</span>
          </div>
          <h2 className="text-2xl font-semibold">0</h2>
          <p className="text-white/50 text-sm">/ {existingUser.calorieIntake} kcal</p>
          <div className="mt-3 h-1 bg-white/10 rounded-full"></div>
        </div>

        {/* Water */}
        <div className="bg-[#1f1f1f] border border-white/10 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-blue-400">💧</span>
            <span className="text-white/40 text-sm">0%</span>
          </div>
          <h2 className="text-2xl font-semibold">0</h2>
          <p className="text-white/50 text-sm">/ {existingUser.water} ml</p>
          <div className="mt-3 h-1 bg-white/10 rounded-full"></div>
        </div>

        {/* Workouts */}
        <div className="bg-[#1f1f1f] border border-white/10 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-green-400">🏋️</span>
          </div>
          <h2 className="text-2xl font-semibold">0</h2>
          <p className="text-white/50 text-sm">done</p>
        </div>

      </div>

      {/* Macros */}
      <div className="bg-[#1f1f1f] border border-white/10 rounded-xl p-4">

        <p className="text-white/70 mb-4">Today's Macros</p>

        <div className="grid grid-cols-3 text-center">

          <div>
            <h2 className="text-xl font-semibold">0g</h2>
            <p className="text-white/40 text-sm">Protein</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">0g</h2>
            <p className="text-white/40 text-sm">Carbs</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">0g</h2>
            <p className="text-white/40 text-sm">Fats</p>
          </div>

        </div>

      </div>

      {/* Chart Section */}
      <div className="bg-[#1f1f1f] border border-white/10 rounded-xl p-4">

        <p className="text-white/70 mb-4">Weekly Calories</p>

        <div className="h-62.5 flex items-center justify-center text-white/40">
          Chart goes here
        </div>

      </div>

    </div>
  )
}

export default DashboardTab