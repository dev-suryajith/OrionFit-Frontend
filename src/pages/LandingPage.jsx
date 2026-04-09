import React, { useEffect } from 'react'
import GatherDataStepper from '../components/GatherDataStepper'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion'

function LandingPage() {
  // logUserWorkout
  const existingUser = JSON.parse(localStorage.getItem('existingUser'))
  const navigate = useNavigate()
  const [showPopUp, setShowPopUp] = useState(false)

  useEffect(() => {
    if (existingUser?.weight) {
      navigate('/dashboard')
    } else {
      setShowPopUp(true)
    }
  }, [existingUser, navigate])

  return (
    <div>
      {existingUser?.weight ?
        <GatherDataStepper /> :
        <div className="fixed inset-0 bg-[#454545] backdrop-blur-sm flex items-center justify-center z-50">

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-[#1f1f1f] border border-white/10 rounded-2xl p-6 w-[90%] max-w-sm text-center shadow-2xl"
          >
            {/* Message */}
            <p className="text-white text-base mb-6">
              Please Login To Continue
            </p>

            {/* Button */}
            <button onClick={()=>navigate('/login')} className="w-full bg-[#90c21d] text-black py-2 rounded-xl font-medium hover:scale-[1.03] active:scale-[0.97] transition">
              Login
            </button>
          </motion.div>
        </div>
      }
    </div>
  )
}

export default LandingPage