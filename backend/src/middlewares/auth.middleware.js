export const isAuthenticated = (req, res, next) => {
    const { userId } = req.auth;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    next();
}

export const isAdmin = async (req, res, next) => {
    if (!req.auth || !req.auth.orgRole || req.auth.orgRole !== "org:admin") {
        return res.status(401).json({ success: false, message: "Unauthorized - You are not an admin" });
    }

    return next();
}