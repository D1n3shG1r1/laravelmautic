import React, { useRef, useEffect } from "react";
import Styles from "../../css/Modules/BootstrapModal.module.css";

const BootstrapModal = ({ id, title, children, onConfirm, onCancel, confirmText = "Understood", modalRef, showFooter = true }) => {
  return (
    <>
      {/* Modal */}
      <div
        ref={modalRef}  // Attach ref here so parent can trigger it
        className="modal fade"
        id={id}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby={`${id}Label`}
        aria-hidden="true"
      >
        <div className={`${Styles.modalDialogWidth} modal-dialog`}>
          <div className="modal-content">
            <div className={`${Styles.modalHeader}`}>
              <h4 className={`${Styles.modalTitle} fs-5`} id={`${id}Label`}>
                {title}
              </h4>
              <button type="button" className={`btn ${Styles.btnClose}`} data-bs-dismiss="modal" aria-label="Close" onClick={onCancel}>
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className={`${Styles.modalBody}`}>{children}</div>

            {/* Conditional rendering of footer */}
            {showFooter && (
              <div className={`${Styles.modalFooter}`}>
                <button type="button" className={`${Styles.marginRight} btn btn-secondary`} data-bs-dismiss="modal">
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={onConfirm}>
                  {confirmText}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BootstrapModal;
