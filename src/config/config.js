import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    jwtSecret: process.env.JWT_SECRET,
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASS
};