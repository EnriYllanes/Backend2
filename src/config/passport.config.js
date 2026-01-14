import passport from 'passport'; //motor de autenticacion 
import jwt from 'passport-jwt'; // estrategia para JSON Web Tokens (JWT)

// herramientas necesarias de librería passport-jwt
const JWTStrategy = jwt.Strategy; // lógica para validar el token
const ExtractJWT = jwt.ExtractJwt; // lógica para encontrar el token en la petición

const cookieExtractor = (req) => {
    let token = null;
    // Si la petición existe y contiene cookies, extraemos la llamada 'coderCookieToken'
    if (req && req.cookies) token = req.cookies['coderCookieToken'];
    return token;
};

const initializePassport = () => { //elegimos nueva estrategia llamada 'jwt'
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "CoderSecretKeyJWT"
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload.user);
        } catch (error) {
            return done(error);
        }
    }));
};

export default initializePassport;