import { Container, Row, Col, Alert } from 'react-bootstrap';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
    const { notification } = useContext(UserContext);

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
                    <RegisterForm />
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterPage;
