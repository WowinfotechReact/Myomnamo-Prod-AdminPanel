import React from 'react';
import { Modal, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
// import editGif from '../assets/Gif/edit.gif';
import CloseIcon from '@mui/icons-material/Close';
import ChangeStatus from '../assets/images/edit.gif';
const StatusChangeModal = ({ open, onClose, onConfirm, message, modelRequestData, stateChangeStatus }) => {


      return (
            <Dialog
                  open={open}
                  onClose={(event, reason) => {
                        if (reason !== 'backdropClick') {
                              onClose();
                        }
                  }}
                  maxWidth="xs"
                  fullWidth
            >
                  <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ textAlign: 'center' }}>Change Status</h3>
                        <IconButton onClick={onClose} edge="end" aria-label="close">
                              <CloseIcon />
                        </IconButton>
                  </DialogTitle>
                  <DialogContent>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div style={{ height: '75px', width: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <img src={ChangeStatus} trigger="loop" colors="primary:#f7b84b,secondary:#f06548" style={{ width: '85px', height: '50px' }} />
                              </div>
                              <>

                                    <label style={{
                                          fontSize: "18px",
                                          marginTop: '16px',
                                          textAlign: 'center',
                                          fontWeight: 'bold',
                                          display: 'block'
                                    }}>
                                          Are you sure you want to change the status?
                                    </label>


                              </>

                        </div>
                  </DialogContent>
                  <DialogActions style={{ justifyContent: 'flex-end', margin: '0 16px 16px 16px' }}>
                        <Button variant="outlined" color="primary" onClick={onClose}>
                              No
                        </Button>
                        <Button variant="contained" color="primary" onClick={onConfirm}>
                              Yes
                        </Button>
                  </DialogActions>
            </Dialog>
      );
};
export default StatusChangeModal;
