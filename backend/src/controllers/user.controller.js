import {apiError} from "../utils/apiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {apiResponse} from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"

const registerUser = asyncHandler(async(req,res)=>{
    const {username, email, password, phone} = req.body

    if([username, email, password, phone].some((field)=> field?.trim() === "")){
        return new apiError(401 , "All fields input are required.")
    }

    //  Requires cloud based software and a middleware to store images.

    // const localProfilePath = req.field?.path;
    // if(!localProfilePath){
    //     return new apiError(401, "Local Profile path not found.")
    // }
    // const profileImage = await uploadOnCloudinary(localProfilePath)

    const user = await User.create({
        username : username.toLowerCase(),
        email,
        password,
        phone,
        profileImage : profileImage || ""
    })

    const createdUser = await User.findById(user._id).select("-refreshToken -password")
    if(!createdUser){
        throw new apiError(401, "Something went wrong.Couldn't find createdUser.")
    }
    
    return res
    .status(201)
    .json(
        new apiResponse(200, createdUser , "User Registered Successfull.")
    )

})

const loginUser = asyncHandler(async(req,res)=>{
    const {username, email, password} = req.body

    if(!username && !email){
        return new apiError(401, "Username or Email is required.")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })
    if(!user){
        throw new apiError(401, "User not found.Invalid username or email.")
    }
    
    const passwordCheck = await user.isPasswordCorrect(password)
    if(!isPasswordCorrect){
        throw new apiError(401, "Invalid username or password.")
    }
    
    // couldn't use the refresh token due to no middleware

    const loggedUser = await User.findById(user._id).select("-password -refreshToken")
    if(!loggedUser){
        throw new apiError(401, "Something went wrong while accessing the logged user.")
    }

    return res
    .status(201)
    .json(
        new apiResponse(200, loggedUser , "User loggin Successfull.")
    )
})


export {registerUser , loginUser}