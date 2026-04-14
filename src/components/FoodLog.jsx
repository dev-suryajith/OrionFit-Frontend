import React, { useEffect, useState } from 'react'
import { Search, ArrowLeft, ArrowRight, Calendar, Trash2 } from 'lucide-react'
import { searchFoodAPI, addFoodAPI, getFoodAPI, deleteFoodAPI } from '../services/allApi'

function FoodLog() {

  const token = localStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };
  const user = JSON.parse(localStorage.getItem("existingUser"))

  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [selectedFood, setSelectedFood] = useState(null)
  const [loading, setLoading] = useState(false)

  const [grams, setGrams] = useState()

  const [manualFood, setManualFood] = useState({
    name: "", calories: "", protein: "", carbs: "", fat: ""
  })

  const [allLogs, setAllLogs] = useState([])
  const [logs, setLogs] = useState([])

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
    setLoading(true)
    const res = await searchFoodAPI({ q: query })
    setResults(res.data || [])
    setLoading(false)
  }

  // select food instead of direct add
  const selectFood = (food) => {
    setSelectedFood(food)
    setGrams(100)
  }

  // add selected food
  const handleAdd = async () => {
    if (!selectedFood) return

    const factor = grams / 100

    const food = {
      ...selectedFood,
      quantity: grams,
      calories: Math.round(selectedFood.calories * factor),
      protein: Math.round(selectedFood.protein * factor),
      carbs: Math.round(selectedFood.carbs * factor),
      fat: Math.round(selectedFood.fat * factor)
    }

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

  // manual food add
  const addManualFood = async () => {

    const factor = grams / 100

    const food = {
      name: manualFood.name,
      quantity: grams,
      calories: Math.round(Number(manualFood.calories) * factor),
      protein: Math.round(Number(manualFood.protein || 0) * factor),
      carbs: Math.round(Number(manualFood.carbs || 0) * factor),
      fat: Math.round(Number(manualFood.fat || 0) * factor)
    }

    await addFoodAPI({
      userId: user._id,
      date: selectedDate,
      food
    }, reqHeader)

    fetchLogs()
    setManualFood({ name: "", calories: "", protein: "", carbs: "", fat: "" })
    setGrams(100)
  }

  const removeFood = async (index) => {
    await deleteFoodAPI({ userId: user._id, date: selectedDate, index }, reqHeader)
    fetchLogs()
  }

  const totalCalories = logs.reduce((acc, f) => acc + (f.calories || 0), 0)

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

      <h2 className="text-xl text-white text-center">Food</h2>

      {/* DATE */}
      <div className="flex justify-between bg-white/5 p-4 rounded-xl">
        <button onClick={() => changeDate(-1)}><ArrowLeft /></button>
        <p className="text-white">{new Date(selectedDate).toDateString()}</p>
        <button onClick={() => changeDate(1)} disabled={selectedDate === today}><ArrowRight /></button>
      </div>

      {/* SEARCH */}
      <div className="bg-white/5 p-5 rounded-xl space-y-3">
        <div className="flex gap-2">
          <input
            placeholder="Search food..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchFood()}
            className="w-full p-2 bg-[#2a2a2a] text-white rounded-lg"
          />
          <button onClick={searchFood} className="bg-[#90c21d] px-4 rounded-lg">
            <Search size={16} />
          </button>
        </div>

        {loading && <p className="text-white/50">Searching...</p>}

        {/* RESULTS */}
        {results.map((food, i) => (
          <div key={i}
            onClick={() => selectFood(food)}
            className="p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
            <p className="text-white">{food.name}</p>
            <p className="text-white/40 text-xs">{food.calories} kcal / 100g</p>
          </div>
        ))}
      </div>

      {/* SELECTED FOOD */}
      {selectedFood && (
        <div className="bg-white/5 p-5 rounded-xl space-y-3">
          <p className="text-white">{selectedFood.name}</p>

          <input
            type="number"
            value={grams}
            onChange={(e) => setGrams(Number(e.target.value))}
            className="w-full p-2 bg-[#2a2a2a] text-white rounded-lg"
            placeholder="Enter grams"
          />

          <p className="text-white/40 text-sm">
            Calories: {Math.round((selectedFood.calories * grams) / 100)} kcal
          </p>

          <button onClick={handleAdd}
            className="w-full bg-[#90c21d] py-2 rounded-lg text-black">
            Add Food
          </button>
        </div>
      )}

      {/* MANUAL ADD */}
      {selectedDate === today && (
        <div className="bg-white/5 p-5 rounded-xl space-y-3">

          <input
            placeholder="Food name"
            value={manualFood.name}
            onChange={(e) => setManualFood({ ...manualFood, name: e.target.value })}
            className="w-full p-2 bg-[#2a2a2a] text-white rounded-lg"
          />

          {["calories", "protein", "carbs", "fat"].map(field => (
            <input
              key={field}
              placeholder={field}
              value={manualFood[field]}
              onChange={(e) => setManualFood({ ...manualFood, [field]: e.target.value })}
              className="w-full p-2 bg-[#2a2a2a] text-white rounded-lg"
            />
          ))}

          <input
            type="number"
            value={grams}
            onChange={(e) => setGrams(Number(e.target.value))}
            className="w-full p-2 bg-[#2a2a2a] text-white rounded-lg"
            placeholder="Quanity in Grams"
          />

          <button onClick={addManualFood}
            className="w-full bg-[#90c21d] py-2 rounded-lg">
            Add Food
          </button>
        </div>
      )}

      {/* TOTAL */}
      <div className="bg-white/5 p-4 rounded-xl">
        <p className="text-white">
          Calories: {totalCalories} / {user.calorieIntake}
        </p>
      </div>

      {/* LOGS */}
      {logs.map((food, i) => (
        <div key={i} className="flex justify-between bg-white/5 p-3 rounded-lg">
          <div>
            <p className="text-white">{food.name}</p>
            <p className="text-white/40 text-xs">
              {food.calories} kcal ({food.quantity}g)
            </p>
          </div>
          <button onClick={() => removeFood(i)}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}

    </div>
  )
}

export default FoodLog