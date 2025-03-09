import React, { useState } from 'react';

const overlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark transparent background
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999, // Ensure it's on top of other content
};

const dialogStyles = {
  backgroundColor: 'white',
  padding: '10px',
  paddingBottom: 0,
  borderRadius: '8px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  width: '400px',
};

const buttonBox = {
  borderTop: '1px solid #e9ecef',
  padding: '10px'
}

const buttonStyles = {
  margin: '5px',
};

const ConfirmBox = ({ message, onConfirm, onCancel }) => {
  return (
    <div style={overlayStyles}>
      <div style={dialogStyles}>
        <p>{message}</p>
        <div style={buttonBox}>
          <button type="button" style={buttonStyles} className="btn cur-p btn-outline-primary" onClick={onCancel}>Cancel</button>
          <button type="button" style={buttonStyles} className="btn cur-p btn-primary" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBox;
