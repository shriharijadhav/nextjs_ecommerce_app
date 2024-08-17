const mongoose = require('mongoose');

const placedOrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    products: {
        type:Array,
        default:[],
    },
    address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'address', required: true },
    contact_number: { type: String, required: true },
    orderPlacedAt: { type: Date, default: Date.now }, // This field will store the date and time of order placement
});

const placedOrderModel = mongoose.models.PlacedOrder|| mongoose.model('PlacedOrder', placedOrderSchema);

module.exports = placedOrderModel;
