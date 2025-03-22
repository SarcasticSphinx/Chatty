import jwt from 'jsonwebtoken'
import user_model from '../models/user.model.js'

export const protectedRoute = async(req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized - No Token provided'
            })
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(401).json({
                message: 'Unauthorized - Invalid Token'
            })
        }

        const user = await user_model.findById(decoded.userId).select('-password')
        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }
        req.user = user
        next()
        
    } catch (error) {
        console.log('Error in protectedRoute Middleware: ', error.message)
        return res.status(500).json({
            message: "Internal server error!"
        })
    }
}