import React, { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import TableStructure from "./TableStructure";
import { ConfigContext } from "context/ConfigContext";
import { ViewTransactionHistoryByUser } from "services/Admin/UsersApi/UsersApi";
import dayjs from "dayjs";

const WalletTransactionModal = ({ show, onHide, dialogData, moduleName }) => {

    const transactionHeads = ["Description", "Debit", "Credit", "Amount", "Date"];
    const referencedHeads = ["Referred By Name", "Referred To Name", "Wallet Amount", "Registered Date", "Note"];
    // Prepare rows as array of objects 
    const tableRows = dialogData?.map((item) => ({
        description: item.description || "-",
        debit: item.debit || 0,
        credit: item.credit || 0,
        amount: item.amount || 0,
        date: dayjs(item.date).format('DD/MM/YYYY') || "-",
        "referred by name": item?.referredByName,
        "referred to name": item?.referredToName,
        "wallet amount": item?.walletAmount,
        "registered date": item.regDate || "-",
        note: item?.note,

    }));



    return (
        <Modal
            style={{ zIndex: 1300 }}
            size="xl"
            show={show}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header>
                <h4 className="text-center">{moduleName === "Referenced History" ? "Refference History" : "Wallet Transaction History"}</h4>
            </Modal.Header>

            <Modal.Body style={{ maxHeight: "60vh", overflow: "auto" }}>
                <TableStructure
                    moduleName={moduleName}
                    tableHeads={moduleName == "Referenced History" ? referencedHeads : transactionHeads}
                    tableRows={tableRows}
                    totalRecords={dialogData?.length}
                    pageSize={10}
                    currentPage={1}
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

export default WalletTransactionModal;
