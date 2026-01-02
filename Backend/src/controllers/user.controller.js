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

const login = asyncHandler(async(req, res)=> {
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



const logout = asyncHandler( async (req, res)=> {
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

const accessRefreshToken = asyncHandler( async(req, res)=> {
    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incommingRefreshToken){
        throw new ApiError(401, "Unauthorized Request !")
    }
    try {
        const decodedToken = jwt.verify(
            incommingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        )

    const user = await User.findById(decodedToken._id);
    if (!user) {
        throw new ApiError(401, "Invalid Refresh Token!")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh Token is expired or used.")
    }

    const options = {
        httpOnly: true,
        secure: true,
    }

    
    const {accessToken, refreshToken} = await addAccessAndRefreshToken(user._id)

    return res
    .status(200)
    .cookie("accessToken", accessToken, options )
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                accessToken,
                refreshToken: refreshToken,
            },
            "Access Token is refreshed successfully"
        )
    )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalide Refresh Token!")
    }
})


const getCurrentUser = asyncHandler(async(req, res)=> {
    if(!req.user){
        throw new ApiError(404, "User not found!");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.user,
            "User Fetched Successfully."
        )
    )
});


export {
    login,
    logout,
    accessRefreshToken,
    getCurrentUser,
}
