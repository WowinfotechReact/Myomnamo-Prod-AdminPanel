import React from "react";
import { Modal, Button, Row, Col, Image } from "react-bootstrap";
import dayjs from "dayjs";
import { FaUser } from "react-icons/fa";

const UserDetailsModal = ({ show, onHide, userData }) => {
    if (!userData) return null;

    const {
        fullName,
        mobileNo,
        email,
        address,
        dob,
        birthPlace,
        birthTime,
        gender,
        zodiacSign,
        profilePhoto,
        applicationType,
        status,
        createdOnDate,
    } = userData;
    const formattedDate = (createdOnDate) => {
        if (!createdOnDate) return "-";
        const [day, month, year] = createdOnDate.split("/");
        const date = new Date(`${year}-${month}-${day}`);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };
    return (
        <Modal
            style={{ zIndex: 1300 }}
            size="lg"
            show={show}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header >
                <Modal.Title>User Details</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div className="p-3">
                    {/* Profile Section */}
                    <Row className="align-items-center mb-4">
                        <Col xs={12} md={3} className="text-center mb-3 mb-md-0">
                            {profilePhoto ? (
                                <Image
                                    src={profilePhoto}
                                    roundedCircle
                                    fluid
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        objectFit: "cover",
                                        border: "2px solid #e0e0e0",
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        borderRadius: "50%",
                                        backgroundColor: "#f0f0f0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "2px solid #e0e0e0",
                                    }}
                                >
                                    <FaUser size={48} color="#9e9e9e" />
                                </div>
                            )}
                        </Col>
                        <Col xs={12} md={9}>
                            <h5 className="fw-bold mb-1 text-capitalize">{fullName || "-"}</h5>
                            <p className="mb-0 text-muted">
                                Registered on:{" "}
                                {createdOnDate ? formattedDate(createdOnDate) : "-"}
                            </p>
                            <p className="mb-0">
                                <strong>Status:</strong>{" "}
                                <span
                                    className={`badge ${status ? "bg-success" : "bg-danger"
                                        } ms-1`}
                                >
                                    {status ? "Active" : "Inactive"}
                                </span>
                            </p>
                        </Col>
                    </Row>

                    {/* Info Cards */}
                    <Row className="g-3">
                        <Col md={6} className="d-flex">
                            <div className="border rounded p-3 bg-light flex-fill d-flex flex-column">
                                <h6 className="fw-semibold mb-2 border-bottom pb-1">
                                    Personal Information
                                </h6>
                                <div className="flex-grow-1">
                                    <p className="mb-1"><strong>Mobile No:</strong> {mobileNo || "-"}</p>
                                    <p className="mb-1"><strong>Email:</strong> {email || "-"}</p>
                                    <p className="mb-1"><strong>Gender:</strong> {gender || "-"}</p>
                                    <p className="mb-1">
                                        <strong>Date of Birth:</strong>{" "}
                                        {dob ? dayjs(dob).format("DD MMM YYYY") : "-"}
                                    </p>
                                    <p className="mb-1"><strong>Birth Time:</strong> {birthTime || "-"}</p>
                                    <p className="mb-0"><strong>Birth Place:</strong> {birthPlace || "-"}</p>
                                </div>
                            </div>
                        </Col>

                        <Col md={6} className="d-flex">
                            <div className="border rounded p-3 bg-light flex-fill d-flex flex-column">
                                <h6 className="fw-semibold mb-2 border-bottom pb-1">
                                    Additional Information
                                </h6>
                                <div className="flex-grow-1">
                                    <p className="mb-1"><strong>Zodiac Sign:</strong> {zodiacSign || "-"}</p>
                                    <p className="mb-1"><strong>Address:</strong> {address || "-"}</p>
                                    <p className="mb-1">
                                        <strong>Application Type:</strong> {applicationType || "-"}
                                    </p>
                                    {/* <p className="mb-0">
                                        <strong>User Key ID:</strong>{" "}
                                        <span className="text-muted small">{userData.userKeyID}</span>
                                    </p> */}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserDetailsModal;
