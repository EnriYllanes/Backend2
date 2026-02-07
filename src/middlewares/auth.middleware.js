export const authorization = (roles) => {
    return async (req, res, next) => {
        // 1. Verificar si hay un usuario (puesto allí por el middleware de Passport)
        if (!req.user) {
            return res.status(401).send({ status: "error", error: "Unauthorized: No user found" });
        }

        // 2. Verificar si el rol del usuario está incluido en los roles permitidos
        // Ejemplo: roles = ['admin'] y req.user.role = 'user' -> Acceso denegado
        if (!roles.includes(req.user.role)) {
            return res.status(403).send({ 
                status: "error", 
                error: "Forbidden: You don't have permission to access this resource" 
            });
        }

        // Si todo está bien, pasamos al siguiente middleware o controlador
        next();
    };
};