import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const Input = ({
    controlId,
    label,
    type,
    placeholder,
    value,
    onChange,
    isValid,
    feedbackText,
    icon,
    ...props
}) => {
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
                    {...props}
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

Input.propTypes = {
    controlId: PropTypes.string.isRequired,
    label: PropTypes.string,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    isValid: PropTypes.func.isRequired,
    feedbackText: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Input.defaultProps = {
    label: '',
    placeholder: '',
    feedbackText: '',
    icon: null,
};

export default Input;

