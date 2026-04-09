import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Dumbbell, Calendar, Clock, Activity, ArrowBigLeft, ArrowBigRight } from 'lucide-react'
import { fetchWorkoutLogAPI, logUserWorkoutAPI } from '../services/allApi'

function WorkoutLog() {
  const token = localStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };

  const [workouts, setWorkouts] = useState([])

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

  const fetchWorkoutLog = async () => {
    try {
      const res = await fetchWorkoutLogAPI(reqHeader)
      setWorkouts(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchWorkoutLog()
  }, [])

  const filteredWorkouts = workouts.filter(
    (workout) => formatDate(workout.createdAt) === selectedDate
  )

  const today = formatDate(new Date())

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Dumbbell className="text-[#90c21d]" /> Workout Log
        </h2>
      </div>

      {/* DATE NAV */}
      <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">

        <button onClick={() => changeDate(-1)} className="p-3 bg-white/10 rounded-full">
          <ArrowBigLeft />
        </button>

        <div className="text-center">
          <p className="text-white font-semibold flex items-center gap-2 justify-center text-lg">
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
          className={`p-3 rounded-full ${selectedDate === today
            ? "bg-white/5 text-white/20"
            : "bg-white/10"
            }`}
        >
          <ArrowBigRight />
        </button>

      </div>

      {/* WORKOUT LIST */}
      <div className="space-y-6">

        {filteredWorkouts.length === 0 && (
          <p className="text-white/40 text-center py-12">
            No workouts logged for this day
          </p>
        )}

        {filteredWorkouts.map((workout) => (
          <motion.div
            key={workout._id}
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 space-y-5"
          >

            {/* WORKOUT HEADER */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                {workout.name}
              </h3>

              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Clock size={14} />
                {workout.duration} min
              </div>
            </div>

            {/* EXERCISE GRID ✅ */}
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

              {workout.exercises.map((ex, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 hover:bg-white/10 transition"
                >

                  {/* Exercise Name */}
                  <p className="text-white font-medium">{ex.name}</p>

                  {/* Sets */}
                  <div className="space-y-2 text-sm text-white/60">
                    {ex.sets.map((set, j) => (
                      <div
                        key={j}
                        className="flex justify-between bg-black/30 px-3 py-2 rounded-lg"
                      >
                        <span>Set {j + 1}</span>
                        <span>{set.reps} reps</span>
                        <span>{set.weight} kg</span>
                      </div>
                    ))}
                  </div>

                </div>
              ))}

            </div>

          </motion.div>
        ))}

      </div>

    </div>
  )
}

export default WorkoutLog