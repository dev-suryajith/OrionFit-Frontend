import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Dumbbell, Calendar, Clock, ArrowLeft, ArrowRight, Plus } from 'lucide-react'
import { fetchWorkoutLogAPI, logUserWorkoutAPI } from '../services/allApi'

function WorkoutLog() {

  const token = localStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };

  const [workouts, setWorkouts] = useState([])
  const [showAdd, setShowAdd] = useState(false)

  const [newWorkout, setNewWorkout] = useState({
    name: "", duration: "", exercises: []
  })

  const formatDate = (date) => {
    const d = new Date(date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }

  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()))
  const today = formatDate(new Date())

  const fetchWorkoutLog = async () => {
    const res = await fetchWorkoutLogAPI(reqHeader)
    setWorkouts(res.data || [])
  }

  useEffect(() => { fetchWorkoutLog() }, [])

  const filteredWorkouts = workouts.filter(
    (w) => formatDate(w.createdAt) === selectedDate
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Dumbbell size={18} className="text-[#90c21d]" />
          Workouts
        </h2>

        <button onClick={() => setShowAdd(true)}
          className="bg-[#90c21d] text-black px-4 py-2 rounded-lg text-sm flex items-center gap-1">
          <Plus size={14} /> Add
        </button>
      </div>

      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl">
        <button onClick={() => setSelectedDate(formatDate(new Date(new Date(selectedDate).setDate(new Date(selectedDate).getDate() - 1))))}
          className="p-2 bg-white/10 rounded-lg">
          <ArrowLeft size={16} />
        </button>

        <p className="text-white text-sm flex items-center gap-2">
          <Calendar size={14} />
          {new Date(selectedDate).toDateString()}
        </p>

        <button onClick={() => setSelectedDate(formatDate(new Date(new Date(selectedDate).setDate(new Date(selectedDate).getDate() + 1))))}
          className="p-2 bg-white/10 rounded-lg">
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredWorkouts.map((workout) => (
          <motion.div key={workout._id}
            className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">

            <div className="flex justify-between">
              <p className="text-white">{workout.name}</p>
              <span className="text-white/40 text-xs flex items-center gap-1">
                <Clock size={12} /> {workout.duration}m
              </span>
            </div>

            {workout.exercises.map((ex, i) => (
              <div key={i} className="bg-black/30 p-3 rounded-lg">
                <p className="text-white text-sm">{ex.name}</p>
              </div>
            ))}

          </motion.div>
        ))}
      </div>

    </div>
  )
}

export default WorkoutLog