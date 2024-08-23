import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import AuthForm from '../components/AuthForm';

const LoginForm = () => {
    const { login } = useContext(UserContext);

    return (
        <AuthForm
            onSubmit={login}
            buttonText="Iniciar sesión"
            showRepeatPassword={false}
        />
    );
};

export default LoginForm;