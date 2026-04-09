import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getWaterLogAPI, logWaterAPI, setWaterIntakeAPI } from '../services/allApi'

function WaterLog() {

  const [existingUser, setExistingUser] = useState(JSON.parse(localStorage.getItem('existingUser')))

  const token = localStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };

  const [showPopup, setShowPopup] = useState(false)
  const [loading, setLoading] = useState(false)

  const [waterLimit, setWaterLimit] = useState("")
  const [waterLogs, setWaterLogs] = useState([])
  const [amount, setAmount] = useState("")

  // 👉 Handle popup confirm
  const handleStart = async () => {
    if (!waterLimit || waterLimit <= 0) return

    try {
      setLoading(true)
      const res = await setWaterIntakeAPI({ water: waterLimit }, reqHeader)

      if (res.status === 200) {
        localStorage.setItem("existingUser", JSON.stringify(res.data))
        setExistingUser(res.data)
        setShowPopup(false)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  // 👉 Add water log
  const addWater = async () => {

    if (!amount || amount <= 0) return

    try {
      const res = await logWaterAPI({ amount: Number(amount) }, reqHeader)

      // Use backend response (source of truth)
      

      setAmount("")

    } catch (err) {
      console.error("Error adding water:", err)
    }
  }

  const getWaterLog=async()=>{
    const res=await getWaterLogAPI(reqHeader)
    setWaterLogs(res.data[0].logs);
    
  }
  
  useEffect(()=>{
    getWaterLog()
  },[])

  const totalWater = waterLogs.reduce((acc, curr) => acc + curr.amount, 0)

  const progress = existingUser?.water
    ? Math.min((totalWater / existingUser.water) * 100, 100)
    : 0

  useEffect(() => {
    if (existingUser) {
      existingUser.water ? setShowPopup(false) : setShowPopup(true)
    } else {
      setShowPopup(true)
    }
  }, [existingUser])

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1f1f1f] p-6 rounded-2xl w-[90%] max-w-sm space-y-5 shadow-2xl border border-white/10"
          >
            <h2 className="text-white text-xl font-semibold text-center">
              💧 Set Daily Water Goal
            </h2>

            <input
              type="number"
              placeholder="Enter daily goal (ml)"
              value={waterLimit}
              onChange={(e) => setWaterLimit(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#2a2a2a] text-white 
              focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={handleStart}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold transition shadow
              ${loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:scale-105 active:scale-95 text-white"
                }`}
            >
              {loading ? "Saving..." : "OK"}
            </button>
          </motion.div>
        </div>
      )}

      {/* MAIN LOGGER */}
      {!showPopup && (
        <div className="space-y-6">

          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">💧 Water Tracker</h2>
            <p className="text-white/50 text-sm">Stay hydrated bro 🚀</p>
          </div>

          {/* Progress Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 shadow-lg">

            <div className="flex justify-between text-sm text-white/60">
              <span>{totalWater} ml</span>
              <span>{existingUser?.water} ml</span>
            </div>

            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-blue-500 h-3 rounded-full"
              />
            </div>

            <p className="text-center text-white/60 text-sm">
              {Math.floor(progress)}% completed
            </p>
          </div>

          {/* Add Water */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">

            <input
              type="number"
              placeholder="Add water (ml)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#2a2a2a] text-white 
              focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={addWater}
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold
              hover:scale-[1.02] active:scale-[0.98] transition shadow"
            >
              + Add Water
            </button>
          </div>

          {/* Logs */}
          <div className="space-y-3">
            {waterLogs.length === 0 ? (
              <p className="text-white/40 text-center py-6">
                No logs yet 💧 Start drinking!
              </p>
            ) : (
              waterLogs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center"
                >
                  <p className="text-white font-medium">{log.amount} ml</p>
                  <p className="text-white/40 text-sm">
                    {log.time}
                  </p>
                </motion.div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  )
}

export default WaterLog