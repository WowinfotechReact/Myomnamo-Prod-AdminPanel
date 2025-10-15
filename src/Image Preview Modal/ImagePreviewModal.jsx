import React from "react";
import { Modal, Button } from "react-bootstrap";

const ImagePreviewModal = ({ show, onHide, imgSrc, title }) => {



      return (
            <Modal style={{ zIndex: 1300 }} show={show} backdrop="static" keyboard={false} centered>
                  <Modal.Header >
                        <Modal.Title>{title || "Image Preview"}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body
                        style={{
                              height: "40vh",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                        }}
                  >
                        <img
                              src={imgSrc}
                              alt="Preview"
                              style={{
                                    maxHeight: "100%", // scales image to fit modal height
                                    maxWidth: "100%", // prevents overflow horizontally
                                    objectFit: "contain", // keeps aspect ratio
                              }}
                        />
                  </Modal.Body>
                  <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>
                              Close
                        </Button>
                  </Modal.Footer>
            </Modal>
      );
};

export default ImagePreviewModal;
