import React  from 'react';
import Modal from 'react-modal';
import { MDBBtn } from 'mdbreact';

const ResetPassword = props => {
    return (
        <Modal
            isOpen={props.modalIsOpen}
            onRequestClose={props.closeModal}
            style={props.customStyles}
        >
            <h2>{props.contentLabel}</h2>
            <div className="reset-password-section">
                <div className="row">
                    <div className="col-md-6 form-group">
                        <label className="fs-14" htmlFor="phone">New Password</label>
                        <input className="form-control" type="password" onChange={e => props.changed(e, 'new_password')} />
                        {props.newPassword.error && <span style={{color: 'red'}}>{props.newPassword.error}</span>}
                    </div>
                    <div className="col-md-6 form-group">
                        <label className="fs-14" htmlFor="phone">Confirm Password</label>
                        <input className="form-control" type="password" onChange={e => props.changed(e, 'confirm_password')} />
                        {props.confirmPassword.error && <span style={{color: 'red'}}>{props.confirmPassword.error}</span>}
                    </div>
                    <div className="registerBtnRow ml-15">
                        <MDBBtn type="submit" className="themeBtnStyle" onClick={props.clicked}>Reset</MDBBtn>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ResetPassword