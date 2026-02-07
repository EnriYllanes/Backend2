import { authorization } from '../middlewares/auth.middleware.js';

// Solo ADMIN crea productos
router.post('/', passport.authenticate('jwt', {session: false}), authorization(['admin']), async (req, res) => {
    // ... lógica de creación ...
});