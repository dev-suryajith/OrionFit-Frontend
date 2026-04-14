import commonAPI from "./commonAPI"
import serverURL from "./serverURL"


// ---------------common----------------
export const registerUserAPI = async (reqBody) => {
    return await commonAPI("POST", `${serverURL}/registerUser`, reqBody)
}
export const loginUserAPI = async (reqBody) => {
    return await commonAPI("POST", `${serverURL}/loginUser`, reqBody)
}
export const gatherUserDataAPI = async (reqBody, reqHeader) => {
    return await commonAPI("POST", `${serverURL}/gatherUserData`, reqBody, reqHeader)
}
export const logUserWorkoutAPI = async (reqBody, reqHeader) => {
    return await commonAPI("POST", `${serverURL}/logUserWorkout`, reqBody, reqHeader)
}
export const fetchWorkoutLogAPI = async (reqHeader) => {
    return await commonAPI("GET", `${serverURL}/fetchWorkoutLog`, {}, reqHeader)
}
export const setWaterIntakeAPI = async (reqBody, reqHeader) => {
    return await commonAPI("POST", `${serverURL}/setWaterIntake`, reqBody, reqHeader)
}
export const searchFoodAPI = async (reqBody,) => {
    return await commonAPI("POST", `${serverURL}/searchFood`, reqBody)
}
export const logWaterAPI = async (reqBody, reqHeader) => {
    return await commonAPI("POST", `${serverURL}/logWater`, reqBody, reqHeader)
}

export const getWaterLogAPI = async (reqHeader) => {
    return await commonAPI("GET", `${serverURL}/getWaterLog`, {}, reqHeader)
}

//Food Logger API
export const addFoodAPI = async (reqBody, reqHeader) => {
    return await commonAPI("POST", `${serverURL}/add-food`, reqBody, reqHeader)
}

export const getFoodAPI = async (userId,reqHeader) => {
    return await commonAPI("GET", `${serverURL}/get-food/${userId}`, {}, reqHeader)
}

export const deleteFoodAPI = async (reqBody) => {
    return await commonAPI("DELETE", `${serverURL}/delete-food`, reqBody, reqHeader)
}


