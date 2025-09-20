import { createContext, useState } from "react"
export const AuthContext = createContext(null);
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../Firebase/Firebase";
function AuthProvider({ children }) {
    const auth = getAuth(app);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);


    // create user
    const createUser = (email, password) => {
        setLoading(false);
        return createUserWithEmailAndPassword(auth, email, password,);
    }
    // sign in
    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }
    const info = {
        createUser,
        user,
        loading,
        signInUser
    }
    return (
        <AuthContext.Provider value={info}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;