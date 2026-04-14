import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gatherUserDataAPI } from '../services/allApi'

function GatherDataStepper() {
    const token = localStorage.getItem("token");
    const reqHeader = { Authorization: `Bearer ${token}` };
    const [userData, setUserData] = useState({
        gender: "",
        age: "",
        height: "",
        weight: "",
        activityLevel: "",
        estimatedCalorie: null,
        goal: "",
        calorieIntake: null
    })

    const [currentStep, setCurrentStep] = useState(1)

    const steps = ["Basic Info", "Body", "Activity", "Review", "Goals", "Finish"]

    const calorieCalculator = () => {
        const { gender, weight, height, age, activityLevel } = userData
        if (!gender || !weight || !height || !age || !activityLevel) return

        let bmr =
            gender === "male"
                ? 10 * weight + 6.25 * height - 5 * age + 5
                : 10 * weight + 6.25 * height - 5 * age - 161

        const activityMap = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725
        }

        const calories = Math.round(bmr * activityMap[activityLevel])

        setUserData(prev => ({ ...prev, estimatedCalorie: calories }))
    }

    const calculateGoalCalories = () => {
        let adjusted = userData.estimatedCalorie

        if (userData.goal === "cut") adjusted -= 500
        else if (userData.goal === "bulk") adjusted += 300

        setUserData(prev => ({ ...prev, calorieIntake: adjusted }))
    }

    const handleNext = () => {

        if (currentStep === 1 && !userData.gender) return alert("Select gender")
        if (currentStep === 2 && (!userData.age || !userData.height || !userData.weight)) return alert("Fill all fields")
        if (currentStep === 3 && !userData.activityLevel) return alert("Select activity level")

        if (currentStep === 3) calorieCalculator()

        if (currentStep === 5 && userData.goal) calculateGoalCalories()

        if (currentStep < steps.length) setCurrentStep(prev => prev + 1)
    }

    const gatherUserData = async () => {
        try {
            const res = await gatherUserDataAPI(userData, reqHeader)
            res.status == 200 && console.log(res.data), localStorage.setItem("existingUser", JSON.stringify(res.data))
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#454545] p-4">

            <div className="w-full max-w-2xl bg-[#1f1f1f] border border-white/10 rounded-2xl shadow-lg p-6">

                <h1 className="text-xl text-white text-center mb-6">Setup Profile</h1>

                <AnimatePresence mode="wait">
                    <motion.div key={currentStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                        {/* STEP 1 */}
                        {currentStep === 1 && (
                            <div className="grid grid-cols-2 gap-3">
                                {["male", "female"].map(g => (
                                    <button key={g}
                                        onClick={() => setUserData({ ...userData, gender: g })}
                                        className={`p-3 rounded-lg border ${userData.gender === g ? "border-[#90c21d] text-[#90c21d]" : "border-white/10 text-white/60"}`}>
                                        {g}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* STEP 2 */}
                        {currentStep === 2 && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <input type="number" placeholder="Age"
                                    className="p-3 bg-[#2a2a2a] rounded-lg text-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                                    onChange={(e) => setUserData({ ...userData, age: e.target.value })} />

                                <input type="number" placeholder="Height"
                                    className="p-3 bg-[#2a2a2a] rounded-lg text-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                                    onChange={(e) => setUserData({ ...userData, height: e.target.value })} />

                                <input type="number" placeholder="Weight"
                                    className="p-3 bg-[#2a2a2a] rounded-lg text-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                                    onChange={(e) => setUserData({ ...userData, weight: e.target.value })} />
                            </div>
                        )}

                        {/* STEP 3 */}
                        {currentStep === 3 && (
                            <div className="grid grid-cols-2 gap-3">
                                {["sedentary", "light", "moderate", "active"].map(level => (
                                    <button key={level}
                                        onClick={() => setUserData({ ...userData, activityLevel: level })}
                                        className={`p-3 rounded-lg border ${userData.activityLevel === level ? "border-[#90c21d]" : "border-white/10 text-white/60"}`}>
                                        {level}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* STEP 4 */}
                        {currentStep === 4 && (
                            <div className="text-white space-y-2">
                                <p>Calories: {userData.estimatedCalorie}</p>
                            </div>
                        )}

                        {/* STEP 5 */}
                        {currentStep === 5 && (
                            <div className="grid grid-cols-3 gap-3">
                                {["cut", "maintain", "bulk"].map(goal => (
                                    <button key={goal}
                                        onClick={() => setUserData({ ...userData, goal })}
                                        className={`p-3 rounded-lg border ${userData.goal === goal ? "border-[#90c21d]" : "border-white/10 text-white/60"}`}>
                                        {goal}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* STEP 6 */}
                        {currentStep === 6 && (
                            <div className="text-white space-y-3 text-center">
                                <p>Estimated Calories: {userData.estimatedCalorie}</p>
                                <p>Goal: {userData.goal}</p>
                                <p className="text-[#90c21d] text-lg font-semibold">
                                    Final Intake: {userData.calorieIntake} kcal/day
                                </p>
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    <button onClick={() => setCurrentStep(prev => prev - 1)} disabled={currentStep === 1}
                        className="px-4 py-2 border border-white/20 text-white/60 rounded-lg">
                        Back
                    </button>

                    <button onClick={() => currentStep === steps.length ? gatherUserData() : handleNext()}
                        className="px-5 py-2 bg-[#90c21d] text-black rounded-lg">
                        {currentStep === steps.length ? "Finish" : "Next"}
                    </button>
                </div>

            </div>
        </div>
    )
}

export default GatherDataStepper