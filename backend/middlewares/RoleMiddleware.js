export const isAdmin = (req, res, next) => {
  console.log("User role:", req.user.role); // Debugging statement
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};
// middlewares/roleMiddlewares.js

export const isAdminOrDoctor = (req, res, next) => {
  console.log("User role:", req.user.role); // Debugging statement
  if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};
export const isDoctor = (req, res, next) => {
  console.log("User role:", req.user.role); // Debugging statement
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

export const isStaff = (req, res, next) => {
  console.log("User role:", req.user.role); // Debugging statement
  if (req.user.role !== 'staff') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};