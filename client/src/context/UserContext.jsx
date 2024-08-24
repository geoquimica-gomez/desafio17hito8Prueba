import { createContext, useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

const API_BASE_URL = "http://localhost:5000/api";
const LOGIN_URL = `${API_BASE_URL}/auth/login`;
const REGISTER_URL = `${API_BASE_URL}/auth/register`;
const USER_INFO_URL = `${API_BASE_URL}/auth/me`;
const CHECKOUT_URL = `${API_BASE_URL}/checkout`;

export const UserProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const navigate = useNavigate();

    const handleFetchResponse = async (response, successMessage, errorMessage) => {
        const data = await response.json();
        console.log(`Respuesta del servidor (${successMessage}):`, data);

        if (response.ok) {
            setNotification({ message: successMessage, type: 'success' });
            return data;
        } else {
            setNotification({ message: data.error || errorMessage, type: 'danger' });
            console.error(`${errorMessage}:`, data.error || 'Error desconocido');
            return null;
        }
    };

    const login = useCallback(async (email, password) => {
        console.log("Intentando iniciar sesión con el email:", email);

        try {
            const response = await fetch(LOGIN_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await handleFetchResponse(response, "Has iniciado sesión correctamente!", "Error durante el inicio de sesión.");
            if (data) {
                setToken(data.token);
                setEmail(data.email);
                localStorage.setItem("token", data.token);
                navigate('/profile');
            }
        } catch (error) {
            console.error("Login failed:", error);
            setNotification({ message: "Error al conectar con el servidor. Inténtalo de nuevo más tarde.", type: "danger" });
        }
    }, [navigate]);

    const register = useCallback(async (email, password) => {
        console.log("Intentando registrar con el email:", email);

        try {
            const response = await fetch(REGISTER_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await handleFetchResponse(response, "Registro exitoso!", "Error durante el registro.");
            if (data) {
                setToken(data.token);
                setEmail(data.email);
                localStorage.setItem("token", data.token);
                navigate('/profile');
            }
        } catch (error) {
            console.error("Registration failed:", error);
            setNotification({ message: "Error al conectar con el servidor. Inténtalo de nuevo más tarde.", type: "danger" });
        }
    }, [navigate]);

    const logout = useCallback(() => {
        setToken(null);
        setEmail(null);
        setUserInfo(null);
        setNotification({ message: "Has cerrado sesión.", type: "success" });
        localStorage.removeItem("token");
        console.log("Sesión cerrada. Token eliminado.");
        navigate('/login');
    }, [navigate]);

    const getUserInfo = useCallback(async () => {
        if (!token) return;

        try {
            const response = await fetch(USER_INFO_URL, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await handleFetchResponse(response, "Información del usuario obtenida con éxito!", "Error al obtener la información del usuario.");
            if (data) setUserInfo(data);
        } catch (error) {
            console.error("Failed to fetch user info:", error);
            setNotification({ message: "Error al conectar con el servidor. Inténtalo de nuevo más tarde.", type: "danger" });
        }
    }, [token]);

    const checkoutCart = useCallback(async (cart) => {
        console.log("Iniciando el checkout con el carrito:", cart);

        if (!token) {
            setNotification({ message: "Por favor, inicia sesión para continuar con el pago.", type: "danger" });
            navigate('/login');
            return false;
        }

        try {
            const response = await fetch(CHECKOUT_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cart }),
            });

            const data = await handleFetchResponse(response, "Compra realizada con éxito!", "Error durante el proceso de compra.");
            return !!data;
        } catch (error) {
            console.error("Checkout failed:", error);
            setNotification({ message: "Error al conectar con el servidor. Inténtalo de nuevo más tarde.", type: "danger" });
            return false;
        }
    }, [token, navigate]);

    useEffect(() => {
        if (token) {
            getUserInfo();
        }
    }, [token, getUserInfo]);

    const value = useMemo(() => ({
        token,
        email,
        userInfo,
        login,
        register,
        logout,
        getUserInfo,
        checkoutCart,
        notification,
    }), [token, email, userInfo, login, register, logout, getUserInfo, checkoutCart, notification]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
