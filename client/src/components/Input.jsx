
import { Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const Input = ({ controlId, label, type, placeholder, value, onChange, isValid, feedbackText, icon, ...props }) => {
    return (
        <Form.Group controlId={controlId}>
            {label && <Form.Label>{label}</Form.Label>}
            <InputGroup>
                {icon && (
                    <InputGroup.Text>
                        <FontAwesomeIcon icon={icon} />
                    </InputGroup.Text>
                )}
                <Form.Control
                    type={type}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    value={value}
                    isInvalid={!isValid() && value.trim() !== ''}
                    style={{
                        borderColor: isValid() ? 'green' : '',
                        borderWidth: isValid() ? '2px' : '',
                    }}
                    {...props} // Pasar cualquier propiedad adicional
                />
                <Form.Control.Feedback type="invalid">
                    {feedbackText}
                </Form.Control.Feedback>
                {isValid() && value.trim() !== '' && (
                    <InputGroup.Text>
                        <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} />
                    </InputGroup.Text>
                )}
            </InputGroup>
        </Form.Group>
    );
};

export default Input;
