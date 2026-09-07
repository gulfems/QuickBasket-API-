export const requireAdmin = (req, res, next) => {
    if (!req.user || !req.user.is_admin) {
        return res.status(403).json({ message: 'You are not authorized to access this resource', status: 403 });
    }
    next(); // Proceed to the next middleware or route handler
}

