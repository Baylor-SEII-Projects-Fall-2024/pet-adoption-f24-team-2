import React from 'react';
import Snackbar  from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function SnackbarNoti({ open, onClose, severity, message}) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={5000}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
            <MuiAlert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
                {message}
            </MuiAlert>
        </Snackbar>
    );
}

export default SnackbarNoti;
