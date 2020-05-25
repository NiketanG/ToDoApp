const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = "154178414758-q3ctvhgq39eaourf6c0btj4dod7v42c8.apps.googleusercontent.com"
const client = new OAuth2Client(CLIENT_ID);

module.exports = async (req, res, next) => {
    const token = req.headers['auth-token']

    if (!token) return res.status(401).json({ error: "Unauthorized, No Access Token Provided" });

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID
        });
        const payload = ticket.getPayload();
        const userId = payload['sub']
        req.user = userId;
        next();
        return userId
    } catch (err) {
        console.log(err)
        return res.status(400).json({ error: "Invalid Token" })
    }
}