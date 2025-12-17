import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";

import { ConfigContext } from "context/ConfigContext";
import { ViewTransactionHistoryByUser } from "services/Admin/UsersApi/UsersApi";
import dayjs from "dayjs";
import TableStructure from "views/Admin/Users/TableStructure";
import Android12Switch from "component/Android12Switch";
import { Tooltip } from "@mui/material";
import { ChangeProductSubscriptionPackageRefillStatus, GetProductSubPackageMontlyStatusList } from "services/Admin/PujaBookingAPI/EstoreBookingAPI";
import StatusChangeModal from "component/StatusChangeModal";

const PujaKitRefillDetails = ({ show, onHide, dialogData, moduleName, setIsAddUpdateDone }) => {
    const { setLoader } = useContext(ConfigContext);
    const [modelRequestData, setModelRequestData] = useState({ estoreBookingKeyID: dialogData?.estoreBookingKeyID })
    const [showStatusChangeModal, setShowStatusChangeModal] = useState(false)

    const [showRefillDetailsModal, setShowRefillDetailsModal] = useState(false);
    const [pujaKitRefillDetails, setPujaKitRefillDetails] = useState(null);

    const ChangeProductSubscriptionPackageRefillStatusData = async (value) => {

        setShowStatusChangeModal(false)
        setLoader(true);
        try {
            const response = await ChangeProductSubscriptionPackageRefillStatus(value?.pspmdsid);


            if (response?.data?.statusCode === 200) {
                setLoader(false);
                if (response?.data?.responseData?.data) {
                    setIsAddUpdateDone(true)

                }
            } else {
                console.error(response?.data?.errorMessage);
                setLoader(false);
            }

        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    };

    const handleStatusChange = (item) => {
        setModelRequestData((prev) => ({ ...prev, changeStatusData: item })); // You can set only relevant data if needed
        setShowStatusChangeModal(true);
    };

    return (
        <>
            <Modal
                style={{ zIndex: 1300 }}
                size="lg"
                show={show}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header>
                    <h4 className="text-center">{"Puja Kit Re-filling Details"}</h4>
                </Modal.Header>

                <Modal.Body style={{ maxHeight: "60vh", overflow: "auto" }}>
                    <Table striped bordered hover>
                        <thead className="table-light">
                            <tr
                                style={{
                                    position: 'sticky',
                                    top: -1,
                                    backgroundColor: '#fff',
                                    zIndex: 10,
                                    boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
                                }}
                                className="text-nowrap"
                            >

                                <th className="text-center">Sr No.</th>
                                <th className="text-center">Month Name</th>
                                <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                    Delivery Date
                                </th>
                                <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                    Refill Status
                                </th>



                            </tr>
                        </thead>

                        <tbody>
                            {dialogData?.map((item, idx) => (
                                <tr className="text-nowrap text-center" key={item.pujaBookingID}>
                                    <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                        {idx + 1}
                                    </td>

                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        {item?.monthName ? (
                                            item.monthName.length > 25 ? (
                                                <Tooltip title={item.monthName}>{item.monthName.substring(0, 25) + '...'}</Tooltip>
                                            ) : (
                                                item.monthName
                                            )
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td style={{ whiteSpace: 'nowrap' }} className="text-center">
                                        {item.deliveryDate || '-'}
                                    </td>


                                    <td
                                        style={{ width: "150px" }}
                                        onClick={() => {
                                            // Only allow if today's date
                                            if (dayjs(item.deliveryDate).isSame(dayjs(), "day")) {
                                                handleStatusChange(item);
                                            }
                                        }}
                                    >
                                        <Tooltip
                                            title={
                                                !dayjs(item.deliveryDate).isSame(dayjs(), "day")
                                                    ? "You can change status only for today's date"
                                                    : item.deliveryStatus
                                                        ? "Enable"
                                                        : "Disable"
                                            }
                                        >
                                            <span style={{ opacity: dayjs(item.deliveryDate).isSame(dayjs(), "day") ? 1 : 0.5 }}>
                                                {item.deliveryStatus ? "Enable" : "Disable"}
                                                <Android12Switch
                                                    style={{ padding: "8px" }}
                                                    checked={item.deliveryStatus === true}
                                                    disabled={!dayjs(item.deliveryDate).isSame(dayjs(), "day")}
                                                />
                                            </span>
                                        </Tooltip>
                                    </td>




                                </tr>
                            ))}
                        </tbody>
                    </Table>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <StatusChangeModal
                open={showStatusChangeModal}
                onClose={() => setShowStatusChangeModal(false)}
                onConfirm={() => ChangeProductSubscriptionPackageRefillStatusData(modelRequestData?.changeStatusData)} // Pass the required arguments
            />
        </>

    );
};

export default PujaKitRefillDetails;
