import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'
import { FaEyeSlash } from "react-icons/fa"
import { IoEyeSharp } from "react-icons/io5"
import { loginUserAPI, registerUserAPI } from '../services/allApi'

function LoginRegister({ register }) {

    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    

    const [formData, setFormData] = useState({
        username: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const handleSubmit = async () => {
        if (register) {
            try {
                const result = await registerUserAPI(formData)
                console.log(result.data)
                result.status==200 && navigate('/login')
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                const result = await loginUserAPI(formData)
                if (result.status === 200) {
                    const { existingUser, token } = result.data
                    localStorage.setItem("existingUser", JSON.stringify(existingUser))
                    localStorage.setItem("token", token)
                    result.status==200 && navigate('/')
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className="h-screen w-screen flex justify-center items-center bg-[#3a3939]">

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-sm p-8 rounded-2xl bg-[#1f1f1f]/10 border border-white/10 shadow-md shadow-[#90c21d]"
            >

                {/* Title */}
                <h1 className="text-xl font-semibold text-center text-white">
                    {register ? "Create Account" : "Login"}
                </h1>

                <p className="text-center text-white/40 text-sm mt-1 mb-6">
                    {register ? "Enter your details to continue" : "Welcome back"}
                </p>

                <div className="flex flex-col gap-4">

                    
                    {register && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-white/10 focus:border-[#90c21d] outline-none text-white placeholder:text-white/40"
                        />
                    )}

                    
                    {register && (
                        <input
                            type="number"
                            placeholder="Phone Number"
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-white/10 focus:border-[#90c21d] outline-none text-white placeholder:text-white/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    )}

                    
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-white/10 focus:border-[#90c21d] outline-none text-white placeholder:text-white/40"
                    />

                    
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full p-3 pr-10 rounded-lg bg-[#2a2a2a] border border-white/10 focus:border-[#90c21d] outline-none text-white placeholder:text-white/40"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
                            {showPassword ? <FaEyeSlash size={16} /> : <IoEyeSharp size={16} />}
                        </button>
                    </div>

                    
                    {register && (
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Confirm Password"
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full p-3 pr-10 rounded-lg bg-[#2a2a2a] border border-white/10 focus:border-[#90c21d] outline-none text-white placeholder:text-white/40"
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
                                {showConfirm ? <FaEyeSlash size={16} /> : <IoEyeSharp size={16} />}
                            </button>
                        </div>
                    )}

                    
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                            if (register && formData.password !== formData.confirmPassword) {
                                alert("Passwords do not match")
                                return
                            }
                            handleSubmit()
                        }}
                        className="w-full bg-[#90c21d] text-black font-medium py-3 rounded-lg hover:bg-[#a8e32a] transition-all"
                    >
                        {register ? "Register" : "Login"}
                    </motion.button>

                    
                    <p className="text-center text-white/40 text-sm mt-2">
                        {register ? "Already have an account?" : "Don't have an account?"}
                        <span onClick={() => register ? navigate('/login') : navigate('/register')} className="text-[#90c21d] cursor-pointer ml-1 hover:underline">
                            {register ? "Login" : "Register"}
                        </span>
                    </p>

                </div>
            </motion.div>
        </div>
    )
}

export default LoginRegister
