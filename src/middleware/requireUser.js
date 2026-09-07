export const requireUser = (req, res, next) => {
    if (!req.user || req.user.role !== 'user') {
        return res.status(403).json({ message: 'You are not authorized to access this resource', status: 403 });
    }
    next();
}