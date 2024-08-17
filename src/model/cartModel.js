const mongoose = require('mongoose')
 
const cartSchema = mongoose.Schema({
    allProductsInCart:{
        type:Array,
        default:[],
    },
   
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    }
})

const cartModel = mongoose.models.Cart || mongoose.model('Cart', cartSchema)

module.exports = cartModel


