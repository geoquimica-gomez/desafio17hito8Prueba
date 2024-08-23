import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import AuthForm from '../components/AuthForm';

const RegisterForm = () => {
    const { register } = useContext(UserContext);

    return (
        <AuthForm
            onSubmit={register}
            buttonText="Registrarse"
            showRepeatPassword={true}
        />
    );
};

export default RegisterForm;