import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { updateIndicatorStatus } from '../store/indicatorsSlice';
import { updateActionSelection } from '../store/actionsSlice';

const headerStyle = {
  backgroundColor: 'transparent',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1.25rem',
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '16px',
};

export default function TableComponent({ isIndicatorTableDisabled, setIsIndicatorTableDisabled }) {
  const dispatch = useDispatch();
  const indicators = useSelector((state) => state.indicators.indicators);
  const actions = useSelector((state) => state.actions.actions);
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [selectedActionId, setSelectedActionId] = useState(null);

  const handleOpen = (indicator) => {
    setModalContent(indicator);
    setOpen(true);
  };

  const handleClose = () => {
    setModalContent(null); 
    setSelectedActionId(null); 
    setOpen(false);
  };

  const handleCheckboxChange = (id, type) => {
    const indicator = indicators.find((ind) => ind.id === id);
    const isCurrentlyChecked = indicator.status === type;
    const newStatus = isCurrentlyChecked ? '' : type;

    dispatch(updateIndicatorStatus({ id, status: newStatus }));

    if (!isCurrentlyChecked) {
      handleOpen(indicator);
    }
  };

  const handleActionCheckboxChange = (id) => {
    const action = actions.find((act) => act.id === id);
    const newSelectedState = selectedActionId === id ? false : true;

    dispatch(updateActionSelection({ id, selected: newSelectedState }));
    setSelectedActionId(newSelectedState ? id : null);

    actions.forEach((act) => {
      if (act.id !== id) {
        dispatch(updateActionSelection({ id: act.id, selected: false }));
      }
    });
  };

  const isSaveButtonDisabled = !selectedActionId;

  const handleSave = () => {
    setIsIndicatorTableDisabled(true);
    handleClose();
  };

  return (
    <>
      <TableContainer component={Paper} style={{ height: '100%', backgroundColor: 'transparent' }}>
        <Table aria-label="indicator table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={headerStyle}>Indicator Description</TableCell>
              <TableCell align="center" style={headerStyle}>Correct</TableCell>
              <TableCell align="center" style={headerStyle}>Wrong</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {indicators.map((indicator) => (
              <TableRow
                key={indicator.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: 'transparent' }}
              >
                <TableCell component="th" scope="row" style={{ backgroundColor: 'transparent', color: isIndicatorTableDisabled ? 'grey' : 'inherit' }}>
                  {indicator.name}
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: 'transparent' }}>
                  <Checkbox
                    checked={indicator.status === 'correct'}
                    onChange={() => !isIndicatorTableDisabled && handleCheckboxChange(indicator.id, 'correct')}
                    disabled={isIndicatorTableDisabled}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: 'transparent' }}>
                  <Checkbox
                    checked={indicator.status === 'wrong'}
                    onChange={() => !isIndicatorTableDisabled && handleCheckboxChange(indicator.id, 'wrong')}
                    disabled={isIndicatorTableDisabled}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={modalStyle}>
          <h2 id="modal-modal-title">Actions for {modalContent?.name}</h2>
          <Table>
            <TableBody>
              {actions.map((action) => (
                <TableRow key={action.id}>
                  <TableCell>{action.action_name}</TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={selectedActionId === action.id}
                      onChange={() => handleActionCheckboxChange(action.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleSave} disabled={isSaveButtonDisabled}>Save</Button>
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </>
  );
}