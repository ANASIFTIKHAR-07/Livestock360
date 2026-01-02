import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"


const addAccessAndRefreshToken = async (userId)=> {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating Access Token & Refresh Token")
    }
}

const login = asyncHandler(async()=> {
    const {email, password} = req.body;

    if(!email || !password) {
        throw new ApiError(400, "Email and Password required!!")
    }

    const user = await User.findOne({
        email
    })

    if(!user){
        throw new ApiError(404, "User Does not Exist!!")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Password is incorrect")
    }

    const {accessToken, refreshToken} = await addAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: false,
        // sameSite:"lax"
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                accessToken, refreshToken, loggedInUser
            },
            "User logged In Successfully"
        )
    )
})



const logout = asyncHandler( async ()=> {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            }
        },
        {
            new: true,
        }
    )

    const options={
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(
            200,
            {},
            "User Logged out successfully",
        )
    )
})


export {
    login,
    logout,
}
