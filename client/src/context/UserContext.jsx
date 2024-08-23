import { createContext, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const navigate = useNavigate();

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
        setNotification({ message: "Has cerrado sesión.", type: "success" });
        localStorage.removeItem("token");
        console.log("Sesión cerrada. Token eliminado.");
        navigate('/login');
    }, [navigate]);

    const value = useMemo(() => ({
        token,
        email,
        login,
        register,
        logout,
        notification,
    }), [token, email, login, register, logout, notification]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
