import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowLeft, ArrowRight, Calendar, Trash2 } from 'lucide-react'
import { searchFoodAPI, addFoodAPI, getFoodAPI, deleteFoodAPI } from '../services/allApi'

function FoodLog() {

  const token = localStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };
  const user = JSON.parse(localStorage.getItem("existingUser"))

  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [selectedFood, setSelectedFood] = useState(null)

  const [manualFood, setManualFood] = useState({
    name: "", calories: "", protein: "", carbs: "", fat: ""
  })

  const [allLogs, setAllLogs] = useState([])
  const [logs, setLogs] = useState([])

  const [quantity, setQuantity] = useState(1)

  const formatDate = (date) => {
    const d = new Date(date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }

  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()))
  const today = formatDate(new Date())

  const changeDate = (days) => {
    const current = new Date(selectedDate)
    current.setDate(current.getDate() + days)
    setSelectedDate(formatDate(current))
  }

  const fetchLogs = async () => {
    const res = await getFoodAPI(user._id, reqHeader)
    setAllLogs(res.data || [])
  }

  useEffect(() => { fetchLogs() }, [])

  useEffect(() => {
    const filtered = allLogs.find(log => log.date === selectedDate)
    setLogs(filtered ? filtered.foods : [])
  }, [selectedDate, allLogs])

  const searchFood = async () => {
    if (!query.trim()) return
    const res = await searchFoodAPI({ q: query })
    setResults(res.data)
  }

  const handleAdd = async (food) => {
    await addFoodAPI({
      userId: user._id,
      date: selectedDate,
      food
    }, reqHeader)

    fetchLogs()
    setSelectedFood(null)
    setResults([])
    setQuery("")
  }

  const addManualFood = () => {
    handleAdd({
      name: manualFood.name,
      quantity: 1,
      calories: Number(manualFood.calories),
      protein: Number(manualFood.protein || 0),
      carbs: Number(manualFood.carbs || 0),
      fat: Number(manualFood.fat || 0)
    })

    setManualFood({ name: "", calories: "", protein: "", carbs: "", fat: "" })
  }

  const removeFood = async (index) => {
    await deleteFoodAPI({ userId: user._id, date: selectedDate, index }, reqHeader)
    fetchLogs()
  }

  const totalCalories = logs.reduce((acc, f) => acc + (f.calories || 0), 0)

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

      <div className="text-center">
        <h2 className="text-xl font-semibold text-white">Food</h2>
      </div>

      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl">
        <button onClick={() => changeDate(-1)} className="p-2 bg-white/10 rounded-lg">
          <ArrowLeft size={16} />
        </button>

        <p className="text-white text-sm flex items-center gap-2">
          <Calendar size={14} />
          {new Date(selectedDate).toDateString()}
        </p>

        <button onClick={() => changeDate(1)} disabled={selectedDate === today}
          className="p-2 bg-white/10 rounded-lg disabled:opacity-30">
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-3">
        <div className="flex gap-2">
          <input
            placeholder="Search food..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchFood()}
            className="w-full p-2.5 bg-[#2a2a2a] border border-white/20 rounded-lg text-white text-sm outline-none focus:border-[#90c21d]"
          />
          <button onClick={searchFood} className="bg-[#90c21d] px-4 rounded-lg text-black">
            <Search size={16} />
          </button>
        </div>
      </div>

      {selectedDate === today &&
        <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-3">
          <input placeholder="Food name"
            value={manualFood.name}
            onChange={(e) => setManualFood({ ...manualFood, name: e.target.value })}
            className="w-full p-2.5 bg-[#2a2a2a] border border-white/20 rounded-lg text-white text-sm outline-none focus:border-[#90c21d]" />

          <div className="grid md:grid-cols-2 gap-3">
            {["calories", "protein", "carbs", "fat"].map((field) => (
              <input key={field}
                placeholder={field}
                value={manualFood[field]}
                onChange={(e) => setManualFood({ ...manualFood, [field]: e.target.value })}
                className="p-2.5 bg-[#2a2a2a] border border-white/20 rounded-lg text-white text-sm outline-none focus:border-[#90c21d]" />
            ))}
          </div>

          <button onClick={addManualFood}
            className="w-full bg-[#90c21d] py-2.5 rounded-lg text-black text-sm">
            Add Food
          </button>
        </div>
      }

      <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
        <p className="text-white text-sm flex justify-between">
          Calories <span>{totalCalories} / {user.calorieIntake}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {logs.map((food, i) => (
          <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-lg">
            <div>
              <p className="text-white">{food.name}</p>
              <p className="text-white/40 text-xs">{food.calories} kcal</p>
            </div>
            <button onClick={() => removeFood(i)}>
              <Trash2 size={14} className="text-red-400" />
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}

export default FoodLog