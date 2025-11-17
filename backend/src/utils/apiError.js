class apiError extends Error{
    constructor(
        statusCode,
        message = "Something Went Wrong.",
        stack = '',
        errors = []
    ){
        super(message)
        this.stack = stack || new Error().stack
        this.statusCode = statusCode
        this.errors = errors
        this.data = null
        this.success = false
    }
}

export {apiError}