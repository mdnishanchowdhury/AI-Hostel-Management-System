import { createContext, useEffect, useState } from "react"
export const AuthContext = createContext(null);
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "../Firebase/Firebase";
function AuthProvider({ children }) {
    const auth = getAuth(app);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


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
     // logOut
    const userLogOut =()=>{
        setLoading(true);
        return signOut(auth);
    }

    // save user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setLoading(false);
            setUser(currentUser);
            console.log('user', currentUser);
        })
        return unsubscribe;
    }, [])

   

    const info = {
        createUser,
        user,
        loading,
        setLoading,
        signInUser,
        userLogOut 
    }
    return (
        <AuthContext.Provider value={info}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;