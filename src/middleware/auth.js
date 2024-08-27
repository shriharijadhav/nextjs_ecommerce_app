const dbConnect = require('@/config/dbConnect');
const AddressModel = require('@/model/addressModel');
const blacklistedTokenModel = require('@/model/blacklistedToken');
const cartModel = require('@/model/cartModel');
const userModel = require('@/model/userModel');
const jwt = require('jsonwebtoken');

async function checkIfUserIsLoggedIn(req, accessToken, refreshToken) {
    await dbConnect();

    try {
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = decodedRefreshToken?.userId;

        // Check if the user exists in the database
        const userFoundInDB = await userModel.findById(userId).lean();
        if (!userFoundInDB) {
            return false; // User does not exist
        }

        // Fetch user details and attach them to the request object
        req.completeUserDetails = await fetchCompleteUserDetails(userFoundInDB);

        // Check if the tokens are blacklisted
        const blacklistedToken = await blacklistedTokenModel.findOne({
            user: userId,
            accessToken: accessToken,
            refreshToken: refreshToken
        }).lean();

        if (blacklistedToken) {
            return false; // Tokens are blacklisted
        }

        // Verify the access token
        const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decodedAccessToken.userId;

        return true; // Access token is valid

    } catch (err) {
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
 
            console.log('access token expired..re-generating')
            return await handleExpiredAccessToken(req, refreshToken);
        }

        console.error(`Authentication failed: ${err.message}`);
        return false; // Other errors
    }
}

// Helper function to fetch user details
async function fetchCompleteUserDetails(user) {
    const [userAddresses, userCart] = await Promise.all([
        AddressModel.find({ user: user._id }).lean(),
        cartModel.findOne({ user: user._id }).lean()
    ]);

    return {
        userProfileInfo: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            contact: user.contact,
            userId: user._id
        },
        userAddresses,
        userCart
    };
}

// Helper function to handle expired access token
async function handleExpiredAccessToken(req, refreshToken) {
    try {
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        req.userId = decodedRefreshToken.userId;

        // Re-generate new access token
        const newAccessToken = jwt.sign({ userId: decodedRefreshToken.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
        
        req.newAccessToken = newAccessToken;

        return true; // Refresh token is valid

    } catch (err) {
        console.error(`Refresh token failed: ${err.message}`);
        return false; // Refresh token is invalid or expired
    }
}

module.exports = checkIfUserIsLoggedIn;
