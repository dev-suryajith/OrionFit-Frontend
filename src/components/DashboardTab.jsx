import React, { useEffect, useState } from 'react'
import { fetchWorkoutLogAPI, getFoodAPI, getWaterLogAPI } from '../services/allApi'

function DashboardTab() {
  const existingUser = JSON.parse(localStorage.getItem('existingUser'))
  const token = sessionStorage.getItem("token")

  const [food, setFood] = useState([])
  const [water, setWater] = useState([])
  const [workouts, setWorkouts] = useState([])

  const reqHeader = {
    Authorization: `Bearer ${token}`
  }

  // 🔥 Greeting logic
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }
  const fetchData = async () => {
    try {
      const foodRes = await getFoodAPI(existingUser._id)
      const waterRes = await getWaterLogAPI(reqHeader)
      const workoutRes = await fetchWorkoutLogAPI(reqHeader)
      console.log(foodRes.data);


      setFood(foodRes.data || [])
      setWater(waterRes.data || [])
      setWorkouts(workoutRes.data || [])
    } catch (err) {
      console.log(err)
    }
  }
  // 🔥 Fetch all data
  useEffect(() => {
    fetchData()
  }, [])

  // 🔥 Calculations
  const totalCalories = food.reduce((acc, item) => acc + item.calories, 0)
  const totalWater = water.reduce((acc, item) => acc + item.amount, 0)

  const caloriePercent = Math.min((totalCalories / existingUser.calorieIntake) * 100, 100)
  const waterPercent = Math.min((totalWater / existingUser.water) * 100, 100)

  return (
    <div className="p-4 sm:p-6 text-white space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold">
          {getGreeting()}, {existingUser.username}
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Here's your daily summary
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Calories */}
        <div className="bg-[#1f1f1f] border border-white/10 rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <span>🔥</span>
            <span className="text-sm">{caloriePercent.toFixed(0)}%</span>
          </div>
          <h2 className="text-2xl font-semibold">{totalCalories}</h2>
          <p className="text-white/50 text-sm">
            / {existingUser.calorieIntake} kcal
          </p>
          <div className="mt-3 h-1 bg-white/10 rounded-full">
            <div
              className="h-1 bg-yellow-400 rounded-full"
              style={{ width: `${caloriePercent}%` }}
            ></div>
          </div>
        </div>

        {/* Water */}
        <div className="bg-[#1f1f1f] border border-white/10 rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <span>💧</span>
            <span className="text-sm">{waterPercent.toFixed(0)}%</span>
          </div>
          <h2 className="text-2xl font-semibold">{totalWater}</h2>
          <p className="text-white/50 text-sm">
            / {existingUser.water} ml
          </p>
          <div className="mt-3 h-1 bg-white/10 rounded-full">
            <div
              className="h-1 bg-blue-400 rounded-full"
              style={{ width: `${waterPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Workouts */}
        <div className="bg-[#1f1f1f] border border-white/10 rounded-xl p-4">
          <span>🏋️</span>
          <h2 className="text-2xl font-semibold">{workouts.length}</h2>
          <p className="text-white/50 text-sm">done today</p>
        </div>

      </div>

      {/* Macros (basic version) */}
      <div className="bg-[#1f1f1f] border border-white/10 rounded-xl p-4">
        <p className="text-white/70 mb-4">Today's Macros</p>

        <div className="grid grid-cols-3 text-center">
          <div>
            <h2>--</h2>
            <p className="text-white/40 text-sm">Protein</p>
          </div>
          <div>
            <h2>--</h2>
            <p className="text-white/40 text-sm">Carbs</p>
          </div>
          <div>
            <h2>--</h2>
            <p className="text-white/40 text-sm">Fats</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default DashboardTab