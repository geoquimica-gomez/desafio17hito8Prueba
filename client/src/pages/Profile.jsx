import { Container, Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';

const Profile = () => {
    const { userInfo, getUserInfo, logout } = useContext(UserContext);

    useEffect(() => {
        getUserInfo();
    }, [getUserInfo]);

    return (
        <Container
            className="mt-4 p-4 bg-light shadow-sm rounded"
            style={{ maxWidth: '700px' }}
        >
            <Row className="align-items-center">
                <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
                    <Image
                        src="https://static.vecteezy.com/system/resources/previews/036/485/265/original/kawaii-pizza-slice-cartoon-character-flat-design-png.png"
                        roundedCircle
                        fluid
                        className="profile-image"
                        style={{ width: '150px', height: '150px' }}
                    />
                </Col>
                <Col xs={12} md={8}>
                    <h1>Bienvenida de vuelta</h1>
                    {userInfo ? (
                        <>
                            <h4>no hay nombre en el backend</h4>
                            <p><strong>Email:</strong> {userInfo.email}</p>
                            <p><strong>Username:</strong> </p>
                            <p><strong>Joined:</strong> </p>
                        </>
                    ) : (
                        <p>Cargando información del usuario...</p>
                    )}
                    <div className="d-flex flex-column flex-sm-row mt-3">
                        <Link to="/edit-profile" className='btn btn-outline-primary me-2 mb-2 mb-sm-0'>Editar Perfil</Link>
                        <Link to="/orders" className='btn btn-outline-secondary me-2 mb-2 mb-sm-0'>Mis Pedidos</Link>
                        <button onClick={logout} className="btn4">🔒Logout</button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;

