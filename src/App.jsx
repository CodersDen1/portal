import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCandidates } from './store/candidatesSlice';
import { setIndicators, updateIndicatorStatus } from './store/indicatorsSlice';
import { setActions, updateActionSelection } from './store/actionsSlice';
import { addEntry, deleteEntry, resetEntries } from './store/entriesSlice';
import TableComponent from './components/TableComponent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const candidatesData = [
  { id: 1, name: 'Candidate 1' },
  { id: 2, name: 'Candidate 2' },
];

const indicatorsData = [
  { id: 1, name: 'Indicator 1', status: '' },
  { id: 2, name: 'Indicator 2', status: '' },
];

const actionsData = [
  { id: 1, action_name: 'Action 1', selected: false },
  { id: 2, action_name: 'Action 2', selected: false },
];

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

function App() {
  const dispatch = useDispatch();
  const [selectedCandidate, setSelectedCandidate] = useState(candidatesData[0]);
  const [isIndicatorTableDisabled, setIsIndicatorTableDisabled] = useState(false);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const entries = useSelector((state) => state.entries.entries);
  const indicators = useSelector((state) => state.indicators.indicators);
  const actions = useSelector((state) => state.actions.actions);

  useEffect(() => {
    dispatch(setCandidates(candidatesData));
    dispatch(setIndicators(indicatorsData));
    dispatch(setActions(actionsData));
  }, [dispatch]);

  const handleAddEntry = () => {
    const selectedIndicator = indicators.find((indicator) => indicator.status !== '');
    const selectedAction = actions.find((action) => action.selected);

    if (selectedIndicator && selectedAction) {
      const newEntry = {
        candidateName: selectedCandidate.name,
        indicatorName: selectedIndicator.name,
        actionName: selectedAction.action_name,
        result: selectedIndicator.status,
      };

      const isDuplicate = entries.some((entry) =>
        entry.candidateName === newEntry.candidateName &&
        entry.indicatorName === newEntry.indicatorName &&
        entry.actionName === newEntry.actionName &&
        entry.result === newEntry.result
      );

      if (isDuplicate) {
        setDuplicateModalOpen(true);
      } else {
        dispatch(addEntry(newEntry));
        resetIndicatorsAndActions();
      }
    }
  };

  const resetIndicatorsAndActions = () => {
    // Reset indicator statuses and action selections
    indicators.forEach((indicator) => {
      dispatch(updateIndicatorStatus({ id: indicator.id, status: '' }));
    });
    actions.forEach((action) => {
      dispatch(updateActionSelection({ id: action.id, selected: false }));
    });

    // Enable the indicator table
    setIsIndicatorTableDisabled(false);
  };

  const handleCloseDuplicateModal = () => {
    setDuplicateModalOpen(false);
    resetIndicatorsAndActions();
  };
  const handleDeleteEntry = (index) => {
    dispatch(deleteEntry(index));
  };

  const handleSubmit = () => {
    console.log('Submitting entries:', entries);
    dispatch(resetEntries());
  }

  return (
    <div className='h-screen w-full bg-gradient-to-r from-[#ff5f6d] to-[#ffc371] p-10 overflow-y-auto'>
      <div className="flex space-x-4 mb-6 self-center items-center justify-center">
        {candidatesData.map((candidate) => (
          <button
            key={candidate.id}
            className={`rounded-full h-12 w-24 ${candidate.id === selectedCandidate.id ? 'bg-yellow-300' : 'bg-gray-300'}`}
            onClick={() => setSelectedCandidate(candidate)}
          >
            {candidate.name}
          </button>
        ))}
      </div>
      <div>
        <h1 className='indicators-class text-2xl'>Indicators</h1>
      </div>
      <div className="bg-slate-700 bg-opacity-25 w-full h-2/5 rounded-xl relative border-black border-2 overflow-hidden">
        <div className="h-full overflow-auto">
          <TableComponent
            isIndicatorTableDisabled={isIndicatorTableDisabled}
            setIsIndicatorTableDisabled={setIsIndicatorTableDisabled}
          />
        </div>
        <button
          onClick={handleAddEntry}
          className="absolute bottom-4 right-4 bg-black rounded-full p-4 flex items-center justify-center text-white"
        >
          <span className="text-xxl">+ Add</span>
        </button>
      </div>
      <div className="mt-10">
        <h2 className='text-2xl'>Added Entries</h2>
       
        <TableContainer component={Paper} style={{ backgroundColor: 'transparent' }}>
          <Table aria-label="entries table">
            <TableHead>
              <TableRow>
                <TableCell>Candidate Name</TableCell>
                <TableCell>Indicator Name</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.candidateName}</TableCell>
                  <TableCell>{entry.indicatorName}</TableCell>
                  <TableCell>{entry.actionName}</TableCell>
                  <TableCell>{entry.result}</TableCell>
                  <TableCell>
                   <Button onClick={() => handleDeleteEntry(index)}>Delete</Button>
    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      
      </div>

      <Modal
        open={duplicateModalOpen}
        onClose={() => setDuplicateModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <h2 id="modal-modal-title">Duplicate Entry</h2>
          <p id="modal-modal-description">
            This entry already exists. You can either delete the existing entry to edit it or create a new entry.
          </p>
          <Button onClick={handleCloseDuplicateModal}>Continue</Button>
        </Box>
      </Modal>
      {entries.length > 0 && (
  <button
    onClick={handleSubmit} // Ensure this is the correct handler for submission
    className="absolute bottom-4 right-4 bg-black rounded-full p-4 flex items-center justify-center text-white"
  >
    <span className="text-xxl">Submit</span>
  </button>
)}
    </div>
  );
}

export default App;
