import { createContext, useEffect, useState } from "react"
export const AuthContext = createContext(null);
import { createUserWithEmailAndPassword, deleteUser, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { app } from "../Firebase/Firebase";
import useAxiosPublic from "../Hook/useAxiosPublic";
function AuthProvider({ children }) {
    const auth = getAuth(app);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();


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
    const userLogOut = () => {
        setLoading(true);
        return signOut(auth);
    }
    //updated profile
    const updatedProfile = (name) => {
        return updateProfile(auth.currentUser, {
            displayName: name
        })
    }

    // delete user
    const deleteUserInfo = (user) => {
        setLoading(true);
        return deleteUser(user || auth.currentUser);
    };

    //save user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser)
            if (currentUser) {
                const useInfo = { email: currentUser.email }
                axiosPublic.post('/auth/jwt', useInfo)
                    .then(res => {
                        if (res.data.token) {
                            localStorage.setItem('access-token', res.data.token)
                        }
                    })
            }
            else {
                localStorage.removeItem("access-token");
            }

            setLoading(false)
        });
        return () => {
            unsubscribe()
        }
    }, [axiosPublic]);



    const info = {
        createUser,
        user,
        loading,
        setLoading,
        signInUser,
        updatedProfile,
        deleteUserInfo,
        userLogOut
    }
    return (
        <AuthContext.Provider value={info}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;