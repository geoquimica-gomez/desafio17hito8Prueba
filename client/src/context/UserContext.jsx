import { createContext, useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const navigate = useNavigate();

    // Método para obtener la información del usuario
    const getUserInfo = useCallback(async () => {
        if (!token) return;

        try {
            const response = await fetch("http://localhost:5000/api/auth/me", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            console.log("Respuesta del servidor (getUserInfo):", data);

            if (response.ok) {
                setUserInfo(data);
                setNotification({ message: "Información del usuario obtenida con éxito!", type: "success" });
            } else {
                setNotification({ message: data.error || "Error al obtener la información del usuario.", type: "danger" });
                console.error("Error al obtener la información del usuario:", data.error || "Error desconocido");
            }
        } catch (error) {
            console.error("Failed to fetch user info:", error);
            setNotification({ message: "Error al conectar con el servidor. Inténtalo de nuevo más tarde.", type: "danger" });
        }
    }, [token]);

    // Método para enviar el carrito de compras al backend
    const checkoutCart = useCallback(async (cart) => {
        console.log("Iniciando el checkout con el carrito:", cart);
    
        if (!token) {
            setNotification({ message: "Por favor, inicia sesión para continuar con el pago.", type: "danger" });
            navigate('/login');
            return;
        }
    
        try {
            console.log("Enviando solicitud a http://localhost:5000/api/checkout");
    
            const response = await fetch("http://localhost:5000/api/checkout", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cart })
            });
    
            console.log("Respuesta del servidor (raw):", response);
    
            const data = await response.json();
            console.log("Respuesta del servidor (checkout):", data);
    
            if (response.ok) {
                setNotification({ message: "Compra realizada con éxito!", type: "success" });
                return true;
            } else {
                setNotification({ message: data.error || "Error durante el proceso de compra.", type: "danger" });
                console.error("Error durante el checkout:", data.error || "Error desconocido");
                return false;
            }
        } catch (error) {
            console.error("Checkout failed:", error);
            setNotification({ message: "Error al conectar con el servidor. Inténtalo de nuevo más tarde.", type: "danger" });
            return false;
        }
    }, [token, navigate]);
    

    const login = useCallback(async (email, password) => {
        console.log("Intentando iniciar sesión con el email:", email);

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log("Respuesta del servidor (login):", data);

            if (response.ok) {
                setToken(data.token);
                setEmail(data.email);
                localStorage.setItem("token", data.token);
                setNotification({ message: "Has iniciado sesión correctamente!", type: "success" });
                console.log("Inicio de sesión exitoso. Token guardado:", data.token);
                navigate('/profile');
            } else {
                setNotification({ message: data.error || "Error durante el inicio de sesión.", type: "danger" });
                console.error("Error al iniciar sesión:", data.error || "Error desconocido");
            }
        } catch (error) {
            console.error("Login failed:", error);
            setNotification({ message: "Error al conectar con el servidor. Inténtalo de nuevo más tarde.", type: "danger" });
        }
    }, [navigate]);

    const register = useCallback(async (email, password) => {
        console.log("Intentando registrar con el email:", email);

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log("Respuesta del servidor (register):", data);

            if (response.ok) {
                setToken(data.token);
                setEmail(data.email);
                localStorage.setItem("token", data.token);
                setNotification({ message: "Registro exitoso!", type: "success" });
                console.log("Registro exitoso. Token guardado:", data.token);
                navigate('/profile');
            } else {
                setNotification({ message: data.error || "Error durante el registro.", type: "danger" });
                console.error("Error durante el registro:", data.error || "Error desconocido");
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
