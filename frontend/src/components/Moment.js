import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { timeAgo } from '../util/DateUtil';
import { Redirect } from 'react-router';
import ConditionalWrap from './ConditionalWrap';
import DeleteModal from './DeleteModal';
import '../styles/Moment.css';

class Moment extends Component {
    constructor(props){
        super(props);
        this.state = {
            toHome: false,
            showAuthModal: false,
        };
        
    };

    deleteMoment = () => {
        this.setState({
            showDeleteModal: true,
        });
    }

    render() {
        const props = this.props;
        return (
            <div
            className="Moment-preview-container"
            style={{backgroundImage: `url(http://${process.env.REACT_APP_IP}/res/polaroid_texture.png)`}}>
            <DeleteModal
                    open={this.state.showDeleteModal}
                    token={this.props.token}
                    momentId={this.props.momentId}
                    onClose={() => this.setState({ showDeleteModal: false })}/>
            {this.state.toHome && <Redirect to={'/'} />}
            { (props.currentUser ? props.currentUser.username === props.user.username : false) && <h1 className="delete-button" onClick={this.deleteMoment}>X</h1> }
                <ConditionalWrap
                    condition={this.props.momentId}
                    wrap={children =>  <Link to={`/moment/${props.momentId}`}>{children}</Link>}
                >
                    <img className="Moment-thumbnail" src={props.image} alt="moment"/>
                    <h1 className="top-caption">{ props.description }</h1>
                </ConditionalWrap>
                    <h1 style={{fontSize: '20px'}}>Posted {timeAgo(props.date)}</h1>
                    {
                        this.props.showSubmittedBy && <h1 className="header-medium-2" style={{ marginTop: '8px'}}>
                            Submitted by <ConditionalWrap
                                        condition={props.user.id !== null}
                                        wrap={children => <Link className="linked-username" to={`/user/${props.user.username}`}>{children}</Link>}
                                    >
                                {(props.user.id === null) ? '[deleted]' : props.user.username}
                            </ConditionalWrap>
                        </h1>
                    }
            </div>
        )
    }
}

export default Moment;
