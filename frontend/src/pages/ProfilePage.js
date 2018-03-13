import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import Loading from '../components/Loading';

import MomentList from '../components/MomentsList';
import CaptionList from '../components/CaptionList';

import '../styles/ProfilePage.css';

class ProfilePage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            token: null,
            profileUser: null,
            moments: [],
            captions: [],
            selectedView: 'captions',
            loading: true,
            error: null,
        }
    }

    componentDidMount(){
        const token = this.getToken();
        const { username } = this.props.match.params;
        let profileUser;

        this.fetchUser(username)
        .then(response => {
            profileUser = response.data.user;
            return axios.all([
                this.fetchUserCaptions(profileUser.id, token), 
                this.fetchUserMoments(profileUser.id, token),
            ])
        })   
        .then(axios.spread((userCaptions, userMoments) => {
            const { captions } = userCaptions.data;
            const { moments } = userMoments.data;      
            this.setState({
                profileUser,
                captions,
                moments,
                loading: false,
            });
        }))      
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

    getToken = () => {
        const cookies = new Cookies();
        const token = cookies.get('token');

        if (token) {
            this.setState({
                token: cookies.get('token'),
            });
        }

        return token;
    }

    fetchUser = (username) => {
        return axios({
            method: 'get',
            url: `http://${process.env.REACT_APP_IP}/api/users/${username}`,
        })
        .catch(error => {
            console.log(error)
            throw new Error('nonexistent user');
        });
    }

    fetchUserCaptions = (id, token) => {
        const headers = { 
            'Authorization': `Bearer ${token}` 
        };
        return axios({
            method: 'get',
            url: `http://${process.env.REACT_APP_IP}/api/captions?user-id=${id}`,
            header: token ? headers : {}
        });
    }

    fetchUserMoments = (id, token) => {
        const headers = { 
            'Authorization': `Bearer ${token}` 
        };
        return axios({
            method: 'get',
            url: `http://${process.env.REACT_APP_IP}/api/moments?user-id=${id}`,
            header: token ? headers : {}
        });
    }

    onCaptionUpdate = (newcaption) => {
        this.setState({
            captions: this.state.captions.map(caption => {
                if(newcaption.caption_id === caption.caption_id){
                    return newcaption;
                }
                return caption;
            }),
        })
    }

    updateView = (selectedView) => {
        this.setState({
            selectedView,
        });
    }

    render(){
        const { user } = this.props;
        const { token, profileUser, moments, captions, selectedView, loading, error } = this.state;
        const views = ['captions', 'moments'];

        if (loading) {
            return <Loading/>
        }

        if (error) {
            return (
                <div className="profile-page-container">
                    <h1 className="header-username">{error}</h1>
                </div>
            )
        }

        return (
            <div className="profile-page-container">
                <div className="profile-page-content">
                    <h1 className="header-username">{`${profileUser.username}'s posts`}</h1>      
                    <ul className='views'>
                        {views.map(view => {
                            return <li  key={view}
                                        className="header-section"
                                        style={view === selectedView ? {color: '#1DE28F'} : null}
                                        onClick={this.updateView.bind(null, view)}>
                                        { (token && user.id === profileUser.id ? 'My ' : '') + view.charAt(0).toUpperCase() + view.slice(1) }
                                </li>
                        })}
                    </ul>
                    {
                        selectedView === views[0]
                        && (
                            ( captions.length === 0 
                                && <h1 className="header-section">There aren't any captions to see here :(</h1> )
                            || <CaptionList 
                                    captions={captions}
                                    showSubmittedBy={false} 
                                    isLinkedToMoment={true} 
                                    momentCreatorId={null}
                                    user={this.props.user}
                                    token={token} 
                                    onCaptionUpdate={this.onCaptionUpdate}>
                            </CaptionList>
                        )
                    }
                    {
                        selectedView === views[1]
                        && ( 
                            ( moments.length === 0 && <h1 className="header-section">There aren't any Moments to see here :(</h1> )
                            || <MomentList Moments={moments}/>
                        )
                    }
                </div>
                <div className="profile-page-sidebar">
                </div>  
            </div>
        )
    }
}

export default ProfilePage;