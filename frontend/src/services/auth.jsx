
const API_URL = "http://localhost:8090/api/auth";

export function getToken() {
    return localStorage.getItem("jwtToken");
}

export function saveSession(data) {
    // Accept common token field names from the existing backend response.
    const token =
        data.accessToken ??
        data.token ??
        data.jwtToken ??
        data.data?.accessToken ??
        data.data?.token;

    if (!token) {
        throw new Error(
            "Login succeeded, but no JWT token was found in the response."
        );
    }

    localStorage.setItem("jwtToken", token);

    const user = data.user ?? data.data?.user;

    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
    }

    window.dispatchEvent(new Event("auth-changed"));
}

export function logout() {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("auth-changed"));
}

export async function getCurrentUser() {
    const token = getToken();

    if (!token) {
        return null;
    }

    const response = await fetch(`${API_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            logout();
            return null;
        }

        throw new Error("Unable to verify your login session.");
    }

    return await response.json();
}