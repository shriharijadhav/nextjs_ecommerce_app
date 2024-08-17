const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    houseAddress: {
        type: String,
    },
    street: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    postalCode: {
        type: String,
    },
    country: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    isDefault: {
        type: Boolean,
        default: false, // Indicates if this is the default address
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Ensure this matches the name of your User model
    }
});

// Use `mongoose.models` to check if the model is already compiled
const AddressModel = mongoose.models.Address || mongoose.model('Address', addressSchema);

module.exports = AddressModel;
