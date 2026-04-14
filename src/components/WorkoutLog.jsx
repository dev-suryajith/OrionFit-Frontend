import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Dumbbell, Calendar, Clock,
  ArrowLeft, ArrowRight, Plus
} from 'lucide-react'

import { fetchWorkoutLogAPI, logUserWorkoutAPI } from '../services/allApi'

function WorkoutLog() {

  const token = localStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };

  const [workouts, setWorkouts] = useState([])
  const [showAdd, setShowAdd] = useState(false)

  const [newWorkout, setNewWorkout] = useState({
    name: "",
    duration: "",
    exercises: []
  })

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

  const fetchWorkoutLog = async () => {
    const res = await fetchWorkoutLogAPI(reqHeader)
    setWorkouts(res.data || [])
  }

  useEffect(() => { fetchWorkoutLog() }, [])

  const filteredWorkouts = workouts.filter(
    (w) => formatDate(w.createdAt) === selectedDate
  )

  // ➕ ADD WORKOUT
  const handleAddWorkout = async () => {
    await logUserWorkoutAPI(newWorkout, reqHeader)
    setShowAdd(false)
    setNewWorkout({ name: "", duration: "", exercises: [] })
    fetchWorkoutLog()
  }

  // ➕ ADD EXERCISE
  const addExercise = () => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: "", sets: [] }]
    }))
  }

  const addSet = (index) => {
    const updated = [...newWorkout.exercises]
    updated[index].sets.push({ reps: "", weight: "" })
    setNewWorkout({ ...newWorkout, exercises: updated })
  }

  return (
    <div className="max-w-3xl mx-auto px-3 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Dumbbell size={18} className="text-[#90c21d]" />
          Workouts
        </h2>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-[#90c21d] text-black px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {/* DATE */}
      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-xl">
        <button onClick={() => changeDate(-1)} className="p-2 bg-white/10 rounded-lg">
          <ArrowLeft size={16} />
        </button>

        <p className="text-white text-sm flex items-center gap-2">
          <Calendar size={14} />
          {new Date(selectedDate).toDateString()}
        </p>

        <button
          onClick={() => changeDate(1)}
          disabled={selectedDate === today}
          className="p-2 bg-white/10 rounded-lg disabled:opacity-30"
        >
          <ArrowRight size={16} />
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-4">

        {filteredWorkouts.length === 0 && (
          <p className="text-white/30 text-center py-6 text-sm">
            No workouts logged
          </p>
        )}

        {filteredWorkouts.map((workout) => (
          <motion.div
            key={workout._id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3"
          >

            {/* HEADER */}
            <div className="flex justify-between">
              <p className="text-white font-medium text-sm">{workout.name}</p>
              <span className="text-white/40 text-xs flex items-center gap-1">
                <Clock size={12} />
                {workout.duration}m
              </span>
            </div>

            {/* EXERCISES */}
            <div className="space-y-2">
              {workout.exercises.map((ex, i) => (
                <div key={i} className="bg-black/30 p-3 rounded-lg">
                  <p className="text-white text-sm">{ex.name}</p>

                  <div className="mt-2 space-y-1 text-xs text-white/50">
                    {ex.sets.map((set, j) => (
                      <div key={j} className="flex justify-between">
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

      {/* ➕ ADD MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-[#1f1f1f] p-5 rounded-xl w-[90%] max-w-md space-y-4 border border-white/10">

            <h3 className="text-white text-sm font-medium">New Workout</h3>

            <input
              placeholder="Workout name"
              value={newWorkout.name}
              onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
              className="w-full p-2 bg-[#2a2a2a] rounded text-white text-sm"
            />

            <input
              placeholder="Duration (min)"
              value={newWorkout.duration}
              onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
              className="w-full p-2 bg-[#2a2a2a] rounded text-white text-sm"
            />

            {/* EXERCISES */}
            {newWorkout.exercises.map((ex, i) => (
              <div key={i} className="bg-white/5 p-3 rounded-lg space-y-2">
                <input
                  placeholder="Exercise name"
                  value={ex.name}
                  onChange={(e) => {
                    const updated = [...newWorkout.exercises]
                    updated[i].name = e.target.value
                    setNewWorkout({ ...newWorkout, exercises: updated })
                  }}
                  className="w-full p-2 bg-[#2a2a2a] rounded text-white text-sm"
                />

                {ex.sets.map((set, j) => (
                  <div key={j} className="flex gap-2">
                    <input
                      placeholder="Reps"
                      value={set.reps}
                      onChange={(e) => {
                        const updated = [...newWorkout.exercises]
                        updated[i].sets[j].reps = e.target.value
                        setNewWorkout({ ...newWorkout, exercises: updated })
                      }}
                      className="flex-1 p-1 bg-[#2a2a2a] rounded text-white text-sm"
                    />
                    <input
                      placeholder="Kg"
                      value={set.weight}
                      onChange={(e) => {
                        const updated = [...newWorkout.exercises]
                        updated[i].sets[j].weight = e.target.value
                        setNewWorkout({ ...newWorkout, exercises: updated })
                      }}
                      className="flex-1 p-1 bg-[#2a2a2a] rounded text-white text-sm"
                    />
                  </div>
                ))}

                <button
                  onClick={() => addSet(i)}
                  className="text-xs text-[#90c21d]"
                >
                  + Add Set
                </button>
              </div>
            ))}

            <button
              onClick={addExercise}
              className="text-[#90c21d] text-sm"
            >
              + Add Exercise
            </button>

            <button
              onClick={handleAddWorkout}
              className="w-full bg-[#90c21d] py-2 rounded text-black text-sm"
            >
              Save Workout
            </button>

          </div>
        </div>
      )}

    </div>
  )
}

export default WorkoutLog