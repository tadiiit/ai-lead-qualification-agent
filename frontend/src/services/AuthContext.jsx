import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    getToken,
    getCurrentUser,
    logout as clearSession,
} from "./auth.jsx";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        let active = true;

        async function checkSession() {
            try {
                const token = getToken();

                if (!token) {
                    if (active) {
                        setUser(null);
                        setVerified(false);
                    }
                    return;
                }

                const currentUser = await getCurrentUser();

                if (active) {
                    if (currentUser) {
                        const normalizedUser =
                            currentUser.user ??
                            currentUser.data?.user ??
                            currentUser;

                        setUser(normalizedUser);
                        setVerified(true);
                    } else {
                        setUser(null);
                        setVerified(false);
                    }
                }
            } catch (error) {
                console.error("Session verification failed:", error);

                if (active) {
                    setUser(null);
                    setVerified(false);
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        checkSession();

        return () => {
            active = false;
        };
    }, []);

    function loginUser(userData) {
        setUser(userData);
        setVerified(true);
    }

    function logoutUser() {
        clearSession();
        setUser(null);
        setVerified(false);
    }

    const isAuthenticated = Boolean(verified && user && getToken());

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                loginUser,
                logoutUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}