import React from 'react';
import Modal from 'react-responsive-modal';
import { deleteMoment } from '../util/ApiUtil';
import LoadingDots from './LoadingDots';
import { Redirect } from 'react-router';

class DeleteModal extends React.Component {
    constructor(props){
        super(props);
        this.state={
            isDeleting: false,
            toHome: false,
        }
    }

    onClose = () => {
        this.props.onClose();
    }
    
    onConfirm = () => {
        const token = this.props.token;
        const momentId = this.props.momentId;
        this.setState({
            isDeleting: true,
        });
        deleteMoment({ token, momentId })
        .then((response) => {
            this.setState({
                toHome: true,
            });
            window.location.reload();
        })
        .catch((error) => {
            console.log(error);
        });
    }
    render(){
        return (
            <div>
                {this.state.toHome && <Redirect to={'/'} />}
                <Modal 
                    open={this.props.open} 
                    showCloseIcon={true}
                    closeOnEsc={true}
                    onClose={this.onClose}
                    classNames={{ overlay: 'modal-overlay', modal: 'modal-container' }} 
                    little>
                    <button className="modal-auth-btn" onClick={this.onConfirm}>
                        {'Confirm'}
                    </button>
                    <button className="modal-auth-btn" onClick={this.onClose}>
                        {'Cancel'}
                    </button>
                    {
                        this.state.isDeleting && <div className="login-working"><LoadingDots/></div>
                    }
                </Modal>
            </div>
        )
    }
};

export default DeleteModal;
