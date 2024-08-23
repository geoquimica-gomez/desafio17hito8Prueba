import { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faCheck } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../context/UserContext';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const { register, notification } = useContext(UserContext);

    const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = () => password.length >= 6;
    const doPasswordsMatch = () => password === repeatPassword;

    const validarDatos = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim() || !isEmailValid() || !isPasswordValid() || !doPasswordsMatch()) {
            setError('Todos los campos son obligatorios y deben ser válidos.');
            return;
        }

        setError('');

        try {
            await register(email, password);
        } catch (error) {
            console.error("Error en el registro:", error);
            setError('Hubo un problema con el registro. Inténtalo más tarde.');
        }
    };

    return (
        <Container
            fluid
            className="p-3"
            style={{
                maxWidth: '70%',
                backgroundColor: '#f7886748',
                margin: '10px auto',
                borderRadius: '10px',
                borderTop: '10px solid #333',
                borderBottom: '10px solid #333'
            }}
        >
            <Row>
                <Col md={4} className="d-none d-md-block">
                    <img
                        src="https://noobcook.com/wp-content/uploads/2022/09/mushroom_margherita_mini_pizza_recipe-620x930.jpg"
                        alt="Decorative"
                        style={{ width: '100%', height: '400px' }}
                    />
                </Col>
                <Col md={8}>
                    <h1>Regístrate</h1>
                    <h6>Únete a nuestra comunidad y disfruta de la mejor pizza!</h6>
                    {notification.message && (
                        <Alert variant={notification.type}>
                            {notification.message}
                        </Alert>
                    )}
                    <Form className='customForm' onSubmit={validarDatos}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Correo *</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </InputGroup.Text>
                                <Form.Control
                                    type="email"
                                    placeholder="Ingresa tu correo"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    isInvalid={!isEmailValid() && email.trim() !== ''}
                                    style={{
                                        borderColor: isEmailValid() ? 'green' : '',
                                        borderWidth: isEmailValid() ? '2px' : '',
                                    }}
                                />
                                <Form.Control.Feedback type="invalid">
                                    El correo no es válido.
                                </Form.Control.Feedback>
                                {isEmailValid() && email.trim() !== '' && (
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} />
                                    </InputGroup.Text>
                                )}
                            </InputGroup>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Contraseña *</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faLock} />
                                </InputGroup.Text>
                                <Form.Control
                                    type="password"
                                    placeholder="Contraseña"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    isInvalid={!isPasswordValid() && password.trim() !== ''}
                                    style={{
                                        borderColor: isPasswordValid() ? 'green' : '',
                                        borderWidth: isPasswordValid() ? '2px' : '',
                                    }}
                                />
                                <Form.Control.Feedback type="invalid">
                                    La contraseña debe tener al menos 6 caracteres.
                                </Form.Control.Feedback>
                                {isPasswordValid() && password.trim() !== '' && (
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} />
                                    </InputGroup.Text>
                                )}
                            </InputGroup>
                        </Form.Group>

                        <Form.Group controlId="formBasicRepeatPassword">
                            <Form.Label>Repite Contraseña *</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faLock} />
                                </InputGroup.Text>
                                <Form.Control
                                    type="password"
                                    placeholder="Repite la contraseña"
                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                    value={repeatPassword}
                                    isInvalid={!doPasswordsMatch() && repeatPassword.trim() !== ''}
                                    style={{
                                        borderColor: doPasswordsMatch() ? 'green' : '',
                                        borderWidth: doPasswordsMatch() ? '2px' : '',
                                    }}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Las contraseñas no coinciden.
                                </Form.Control.Feedback>
                                {doPasswordsMatch() && repeatPassword.trim() !== '' && (
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} />
                                    </InputGroup.Text>
                                )}
                            </InputGroup>
                        </Form.Group>

                        <Button type="submit" className='btn3' style={{ width: '100%', marginTop: '15px' }}>
                            Registrarse
                        </Button>
                        <div className="mt-3">
                            {error && <Alert variant="danger">{error}</Alert>}
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterPage;
