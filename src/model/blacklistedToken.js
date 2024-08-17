const mongoose = require('mongoose');

const blacklistedTokenSchema = mongoose.Schema({
    accessToken:{
        type: String
    },
    refreshToken:{
        type: String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
    }
})

const blacklistedTokenModel =  mongoose.models.BlacklistedToken|| mongoose.model('BlacklistedToken', blacklistedTokenSchema)

module.exports = blacklistedTokenModel
