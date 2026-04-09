import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowBigLeft, ArrowBigRight, Calendar, Plus, Trash2 } from 'lucide-react'

import { searchFoodAPI, addFoodAPI, getFoodAPI, deleteFoodAPI } from '../services/allApi'

function FoodLog() {

  const token = localStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };

  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [selectedFood, setSelectedFood] = useState(null)

  const [allLogs, setAllLogs] = useState([])
  const [logs, setLogs] = useState([])

  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const user = JSON.parse(localStorage.getItem("existingUser"))

  // DATE SYSTEM
  const formatDate = (date) => {
    const d = new Date(date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }

  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()))

  const changeDate = (days) => {
    const current = new Date(selectedDate)
    current.setDate(current.getDate() + days)
    setSelectedDate(formatDate(current))
  }

  const today = formatDate(new Date())

  // FETCH
  const fetchLogs = async () => {
    try {
      const res = await getFoodAPI(user._id, reqHeader)
      setAllLogs(res.data || [])
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  // FILTER
  useEffect(() => {
    const filtered = allLogs.find(log => log.date === selectedDate)
    setLogs(filtered ? filtered.foods : [])
  }, [selectedDate, allLogs])

  // SEARCH
  const searchFood = async () => {
    if (!query.trim()) return

    try {
      setLoading(true)
      const res = await searchFoodAPI({ q: query })
      setResults(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  // ADD
  const addFood = async (food) => {
    if (!food.name) return

    const newFood = {
      name: food.name,
      quantity,
      calories: Number(food.calories) * quantity,
      protein: Number(food.protein) * quantity,
      carbs: Number(food.carbs) * quantity,
      fat: Number(food.fat) * quantity
    }

    await addFoodAPI({
      userId: user._id,
      date: selectedDate,
      food: newFood
    }, reqHeader)

    fetchLogs()
    setSelectedFood(null)
    setQuery("")
    setResults([])
    setQuantity(1)
  }

  // DELETE
  const removeFood = async (index) => {
    await deleteFoodAPI({
      userId: user._id,
      date: selectedDate,
      index
    }, reqHeader)

    fetchLogs()
  }

  // TOTAL
  const totals = logs.reduce(
    (acc, food) => {
      acc.calories += food.calories || 0
      return acc
    },
    { calories: 0 }
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Food Logger</h2>
        <p className="text-white/40 text-sm">Track your daily intake</p>
      </div>

      {/* DATE NAV */}
      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-2xl">

        <button
          onClick={() => changeDate(-1)}
          className="p-2 bg-[#2a2a2a] rounded-lg hover:bg-[#3a3a3a]"
        >
          <ArrowBigLeft />
        </button>

        <div className="text-center">
          <p className="text-white font-semibold flex items-center gap-2 justify-center">
            <Calendar size={18} />
            {new Date(selectedDate).toDateString()}
          </p>

          <button
            onClick={() => setSelectedDate(today)}
            className="text-xs text-[#90c21d]"
          >
            Today
          </button>
        </div>

        <button
          onClick={() => changeDate(1)}
          disabled={selectedDate === today}
          className={`p-2 rounded-lg ${selectedDate === today
            ? "bg-white/5 text-white/20"
            : "bg-[#2a2a2a] hover:bg-[#3a3a3a]"
            }`}
        >
          <ArrowBigRight />
        </button>

      </div>

      {/* SEARCH */}
      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3">

        <div className="flex gap-2">
          <input
            placeholder="Search food..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchFood()}
            className="flex-1 p-3 rounded-lg bg-[#2a2a2a] text-white outline-none"
          />

          <button
            onClick={searchFood}
            className="bg-[#90c21d] text-black px-4 rounded-lg"
          >
            {loading ? "..." : <Search />}
          </button>
        </div>

        {/* RESULTS */}
        {results.length > 0 && (
          <div className="max-h-52 overflow-y-auto space-y-2">
            {results.map((food, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedFood(food)
                  setQuantity(1)
                }}
                className="p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <p className="text-white">{food.name}</p>
                <p className="text-white/40 text-sm">{food.calories?.toFixed(0)} kcal</p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* SELECTED FOOD */}
      {selectedFood && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4"
        >
          <h3 className="text-white font-semibold">{selectedFood.name}</h3>

          <div className="flex items-center gap-3">
            <span className="text-white/60">Qty (100g)</span>
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 p-2 bg-[#2a2a2a] text-white rounded-lg"
            />
          </div>

          <button
            onClick={() => addFood(selectedFood)}
            className="w-full bg-[#90c21d] text-black py-2 rounded-xl flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add Food
          </button>
        </motion.div>
      )}

      {/* TOTAL + PROGRESS */}
      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">

        {/* TEXT */}
        <div className="flex justify-between items-center">
          <p className="text-white/60 text-sm">Calories</p>
          <p className="text-white font-semibold">
            {totals.calories} / {user.calorieIntake} kcal
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full h-3 bg-[#2a2a2a] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${totals.calories > user.calorieIntake
                ? "bg-red-500"
                : "bg-[#90c21d]"
              }`}
            style={{
              width: `${Math.min((totals.calories / user.calorieIntake) * 100, 100)}%`
            }}
          />
        </div>

        {/* OPTIONAL STATUS TEXT */}
        <p className="text-xs text-white/40 text-right">
          {totals.calories > user.calorieIntake
            ? `Exceeded by ${totals.calories - user.calorieIntake} kcal`
            : `${user.calorieIntake - totals.calories} kcal remaining`}
        </p>

      </div>

      {/* LOGS */}
      <div className="space-y-3">
        {logs.length === 0 ? (
          <p className="text-white/30 text-center">No food logged</p>
        ) : (
          logs.map((food, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center"
            >
              <div>
                <p className="text-white">{food.name}</p>
                <p className="text-white/40 text-sm">
                  {food.quantity}x • {food.calories} kcal
                </p>
              </div>

              <button onClick={() => removeFood(i)}>
                <Trash2 size={16} className="text-red-400" />
              </button>
            </motion.div>
          ))
        )}
      </div>

    </div>
  )
}

export default FoodLog