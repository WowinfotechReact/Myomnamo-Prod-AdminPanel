import React from "react";


function DateErrorMessage({ errorMessage, dateError }) {
    if (!dateError) {
        return null
    }
    return (
        <>
            {dateError && (<span className='error-msg' style={{ color: "red" }}>{errorMessage}</span>)}
        </>
    )
}
export default DateErrorMessage