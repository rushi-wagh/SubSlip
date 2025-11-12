import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"
import User from "../models/users.models.js"    


export const changeRole = asyncHandler(async(req,res) => {
    const userRole = req.user.role
    

    if(userRole !== 'HOD'){
        throw new ApiError(400,"Only HOD can change roles")
    }

    const { email,role} = req.body
    const user = await User.findOne({
        email
    })
    if(!user){
        throw new ApiError(404,"User not found")
    }   
    if(user.role === role){
        throw new ApiError(400,`User is already a ${role}`)
    }
    user.role = role
    await user.save({validateBeforeSave:false})
    const userData = await User.findById(user._id).select("-password")
    return res.status(200).json(new ApiResponse(200,userData,`User role changed to ${role} successfully`))
})