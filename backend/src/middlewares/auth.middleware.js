export const isAuthenticated = (req, res, next) => {
    const { userId } = req.auth;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    next();
}