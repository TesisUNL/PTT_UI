

import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { PropTypes } from 'prop-types';

CustomModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  requiredIndication: PropTypes.string,
  children: PropTypes.element,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default function CustomModal({
  open,
  handleClose,
  title,
  description,
  requiredIndication,
  children,
  width = "50%",
}) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      BackdropProps={{
          timeout: 700,
      }}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width,
        maxWidth: '400px',
        minWidth: '250px',
        bgcolor: 'background.paper',
        borderRadius: '5px',
        boxShadow: 24,
        p: 4,
      }}>
        <h3>{title}</h3>
        <Typography id='modal-modal-description' sx={{ mt: 2 }} component='span'>
          { description }
          <Typography variant="body2" sx={{ mt: 2 }}>
            { requiredIndication }
          </Typography>
          {
            children
          }
        </Typography>
      </Box>

    </Modal>
  )
}
