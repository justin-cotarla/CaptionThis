import React from 'react';
import Loading from '../components/Loading';
import MomentList from '../components/MomentList';
import CaptionList from '../components/CaptionList';
import NavBar from '../components/NavBar';
import ErrorGraphic from '../components/ErrorGraphic';

import { fetchUser, fetchCaptions, fetchMoments, RequestTypes } from '../util/ApiUtil';
import { formatJoinDate } from '../util/DateUtil';

import '../styles/ProfilePage.css';

class ProfilePage extends React.Component {
    MOMENT_RANGE = 10;

    constructor(props){
        super(props);
        this.state = {
            token: props.token,
            profileUser: null,
            selectedView: 'captions',
            loading: true,
            user: props.user,
            error: null,
        }
    }

    componentDidMount(){
        const { username } = this.props.match.params;
        this.fetchUser(username)
    }

    componentWillReceiveProps(nextProps){
        const currentProfileUser = this.state.profileUser.username;
        const nextProfileUser = nextProps.match.params.username;
        if (nextProfileUser !== currentProfileUser) {
            window.location.reload();
        }
    }

    fetchUser = username => {
        let profileUser;
        
        fetchUser(username)
        .then(response => {
            profileUser = response.data.user;
            this.setState({
                profileUser,
                loading: false,
            });
        })   
        .catch(error => {
            console.log(error);

            let message = '';
            if (error.message === 'nonexistent user') {
                message = 'The user you are looking for doesn\'t exist :(';
            } else {
                message = 'Oops... Something went wrong!';
            }

            this.setState({
                loading: false,
                error: message,
            });
        });
    }

    updateView = (selectedView) => {
        this.setState({
            selectedView,
        });
    }

    render(){
        const { user } = this.props;
        const { token, profileUser, selectedView, loading, error } = this.state;
        const views = ['captions', 'moments'];

        if (loading) {
            return <Loading/>
        }

        if (error) {
            return (
                <div style={{display: 'inline', minHeight: '100%'}}>
                    <NavBar user={this.state.user}/>
                    <div className="profile-page-container">
                        <ErrorGraphic message={error}/>
                    </div>
                </div>
            )
        }

        return (
            <div style={{display: 'inline', minHeight: '100%'}}>
                <NavBar user={this.state.user}/>
                <div className="profile-page-container">
                    <div className="profile-page-content">
                        <h1 className="header-username">{`${profileUser.username}'s posts`}</h1>
                        <ul className='views'>
                            {views.map(view => {
                                return <li  key={view}
                                            className="header-section"
                                            style={view === selectedView ? {color: '#1DE28F'} : {cursor: 'pointer'}}
                                            onClick={this.updateView.bind(null, view)}>
                                            { (token && user.id === profileUser.id ? 'My ' : '') + view.charAt(0).toUpperCase() + view.slice(1) }
                                    </li>
                            })}
                        </ul>
                        {
                            selectedView === views[0]
                            && (
                                <CaptionList
                                    fetchCaptions={(filter) => fetchCaptions({ 
                                        token, 
                                        type: RequestTypes.BY_USER, 
                                        filter, 
                                        userId: profileUser.id 
                                    })}
                                    showSubmittedBy={false} 
                                    count={profileUser.captionCount}
                                    isLinkedToMoment={true} 
                                    isInteractive={false}
                                    momentCreatorId={null}
                                    user={this.props.user}
                                    token={token}/>
                            )
                        }
                        {
                            selectedView === views[1]
                            && (
                                <MomentList 
                                    count={profileUser.momentCount}
                                    showSubmittedBy={true}
                                    user={this.props.user}
                                    token = {this.props.token}
                                    fetchMoments={(filter, page) => fetchMoments({
                                        token,
                                        type: RequestTypes.BY_USER, 
                                        filter,
                                        userId: profileUser.id, 
                                        range: this.MOMENT_RANGE,
                                        start: this.MOMENT_RANGE * page,
                                    })}/>
                            )
                        }
                    </div>
                    <div className="profile-page-sidebar">
                        <h1 className="header-section">About { (token && user.id === profileUser.id ? 'Me' : profileUser.username) }</h1>
                        <h1 className="header-info">Joined: { formatJoinDate(profileUser.dateAdded) }</h1>
                        <h1 className="header-section">Stats</h1>
                        <h1 className="header-info">Score: {profileUser.totalVote}</h1>
                        <h1 className="header-info">Accepted captions: {profileUser.acceptCount}</h1>
                        <h1 className="header-info">Rejected captions: {profileUser.rejectCount}</h1>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProfilePage;
