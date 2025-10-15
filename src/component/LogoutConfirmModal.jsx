import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Lottie from 'react-lottie';
import PropTypes from 'prop-types';
import { useAuth } from 'context/ConfigContext';
import logoutImg from '../assets/images/logout.png'
// import logoutAnimation from './animations/logout-animation.json'; // Get from LottieFiles
// import { ReactComponent as GpsIcon } from './assets/gps-pin.svg';

const LogoutModal = ({ show, onConfirm, onCancel }) => {
  const { logout } = useAuth();
  // Lottie animation options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    // animationData: logoutAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      backdrop="static"
      keyboard={false}
      className="logout-confirmation-modal"
      style={{ zIndex: 1300 }}
    >
      <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
        <Modal.Title id="logout-modal-title" className="w-100 text-center">
          {/* <GpsIcon 
            style={{ 
              width: '60px', 
              height: '60px', 
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }} 
          /> */}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        <div className="gps-pin-animation">
          <img src={logoutImg} width={70} height={70}></img>

        </div>



        <h4 className="mb-3" style={{ color: '#2c3e50' }}>
          Confirm Logout
        </h4>
        <p className="text-muted">
          Are you sure you want to logout ?
        </p>

      </Modal.Body>

      <Modal.Footer style={{ border: 'none', paddingTop: 0 }}>
        <div className="w-100 d-flex justify-content-center gap-3">
          <Button
            variant="outline-secondary"
            onClick={onCancel}
            style={{
              width: '120px',
              padding: '8px',
              fontWeight: 600,
              borderRadius: '20px'
            }}
          >
            Cancel
          </Button>


          <Button

            onClick={logout}
            style={{
              background: '#a52444',
              width: '120px',
              padding: '8px',
              fontWeight: 600,
              borderRadius: '20px',
              boxShadow: '0 2px 6px rgba(219, 222, 231, 0.3)'
            }}
          >
            Logout
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

// PropTypes for type checking
LogoutModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default LogoutModal;