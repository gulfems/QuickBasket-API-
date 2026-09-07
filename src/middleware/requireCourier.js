export const requireCourier = (req, res, next) => {
    if (!req.user || req.user.role !== 'courier') {
        return res.status(403).json({ message: 'You are not authorized to access this resource', status: 403 });
    }
    next();
}