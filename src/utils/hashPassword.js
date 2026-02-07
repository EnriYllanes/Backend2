import bcrypt from 'bcrypt';

// Hashea la contraseña para guardarla en la DB
export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Compara la contraseña ingresada con la de la DB
export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
};