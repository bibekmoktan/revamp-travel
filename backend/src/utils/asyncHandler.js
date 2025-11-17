
const asyncHandler = (requestHandler)=> 
    async(req, res, next)=> {
        try {
            return await requestHandler(req,res,next)
        } catch (error) {
            return res.status(401).json({
                success : false,
                message : error.message || "Error at asyncHandler."
            })
        }   
}

export {asyncHandler}