import NoResultFoundModel from "component/NoResultFoundModal";
import React from "react";
import { Table, Tooltip } from "react-bootstrap";


const TableStructure = ({
    moduleName,
    tableHeads = [],
    tableRows = [],
    showSrNo = true,
    totalDebit,
    totalCredit,
    totalAmount,
    totalRecords,
    pageSize = 10,
    currentPage = 1,
}) => {

    console.log("tableRows", tableRows)
    return (
        <>
            <Table striped bordered hover>
                <thead className="table-light">
                    <tr
                        style={{
                            position: "sticky",
                            top: -1,
                            backgroundColor: "#fff",
                            zIndex: 10,
                            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                        }}
                        className="text-nowrap"
                    >
                        {showSrNo && <th className="text-center">Sr No.</th>}
                        {tableHeads.map((head, index) => (
                            <th key={index} className="text-center" style={{ whiteSpace: "nowrap" }}>
                                {head}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {tableRows?.length > 0 ? (
                        <>
                            {tableRows.map((item, idx) => (
                                <tr className="text-nowrap text-center" key={idx}>
                                    {showSrNo && (
                                        <td className="text-center">
                                            {(currentPage - 1) * pageSize + idx + 1}
                                        </td>
                                    )}

                                    {/* Dynamically render all fields */}
                                    {tableHeads.map((head, i) => {

                                        const key = head.toLowerCase(); // match your data keys
                                        const val = item[key];

                                        return (
                                            <td key={i} style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                                                {val ?? "-"}
                                            </td>



                                        );
                                    })}
                                </tr>
                            ))}

                            {/* ✅ Totals Row */}
                            <tr className="fw-bold text-center" style={{ backgroundColor: "#f8f9fa" }}>
                                {showSrNo && <td>-</td>}
                                {moduleName === "Referenced History" && showSrNo && <td></td>}
                                {tableHeads.map((head, i) => {
                                    const key = head.toLowerCase();

                                    // handle totals dynamically
                                    if (["debit", "credit", "amount", "wallet amount"].includes(key)) {
                                        const total = tableRows.reduce(
                                            (sum, row) => sum + (parseFloat(row[key]) || 0),
                                            0
                                        );
                                        return <td key={i}>{total.toFixed(2)}</td>;
                                    }

                                    // label "Total" under first column
                                    if (
                                        (moduleName === "Referenced History" && i === 1) ||
                                        (moduleName !== "Referenced History" && i === 0)
                                    ) {
                                        return <td key={i}>Total</td>;
                                    }



                                })}
                            </tr>
                        </>
                    ) : (
                        <tr>
                            <td colSpan={tableHeads.length + (showSrNo ? 1 : 0)} className="text-center">
                                No Wallet Transactions Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* {totalRecords <= 0 && <NoResultFoundModel totalRecords={totalRecords} />} */}
        </>
    );
};

export default TableStructure;
