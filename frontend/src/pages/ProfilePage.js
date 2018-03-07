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
            user: null,
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
        
        const user = this.fetchUser(username);
        
        axios.all([
            this.fetchUserCaptions(user.user_id, token), 
            this.fetchUserMoments(user.user_id, token),
        ])
        .then(axios.spread((userCaptions, userMoments) => {
            const { captions } = userCaptions.data;
            const { moments } = userMoments.data;      
            this.setState({
                user,
                captions,
                moments,
                loading: false
            })
        })) 
        .catch(error => {
            console.log(error);
            this.setState({
                loading: false,
                error: 'Oops... Something went wrong!',
            })
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
        // Hardcoded user id until an endpoint to get user info from username is created
        return {   
            user_id: 2,
            username,  
        }
    }

    fetchUserCaptions = (id, token) => {
        const headers = { 
            'Authorization': `Bearer ${token}` 
        };
        return axios({
            method: 'get',
            url: `http://${process.env.REACT_APP_IP}:/api/captions?user-id=${id}`,
            header: token ? headers : {}
        });
    }

    fetchUserMoments = (id, token) => {
        const headers = { 
            'Authorization': `Bearer ${token}` 
        };
        return axios({
            method: 'get',
            url: `http://${process.env.REACT_APP_IP}:/api/moments?user-id=${id}`,
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
        const { token, user, moments, captions, selectedView, loading, error } = this.state;
        const views = ['captions', 'moments'];

        if (loading) {
            return <Loading/>
        }

        if (error) {
            return <h1 className="header-username">Oops... Something went wrong!</h1>
        }

        return (
            <div className="profile-page-container">
                <div className="profile-page-content">
                    <h1 className="header-username">{`${user.username}'s posts`}</h1>
                  
                    <ul className='views'>
                        {views.map(view => {
                            return <li  key={view}
                                        className="header-section"
                                        style={view === selectedView ? {color: '#1DE28F'} : null}
                                        onClick={this.updateView.bind(null, view)}>
                                        { token ? `My ${view}` : view.charAt(0).toUpperCase() + view.slice(1) }
                                </li>
                        })}
                    </ul>
                    {
                        selectedView === views[0]
                        && <CaptionList 
                                captions={captions} 
                                isLinkedToMoment={true} 
                                token={token} 
                                onCaptionUpdate={this.onCaptionUpdate}>
                            </CaptionList>
                    }
                    {
                        selectedView === views[1]
                        && ( 
                            ( moments.length > 0 && <MomentList Moments={moments}/> )
                            || <h1 className="header-section">There aren't any Moments to see here :(</h1> 
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