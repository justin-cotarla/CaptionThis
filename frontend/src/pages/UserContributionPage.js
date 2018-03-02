import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import Header from '../components/Header';
import Loading from '../components/Loading';

import MomentList from '../components/MomentsList';
import CaptionList from '../components/CaptionList';

import '../styles/UserContribution.css';

class UserContributionPage extends React.Component {
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
        const { id } = this.props.match.params;
        
        const user = this.fetchUser(id);
        
        this.fetchUserCaptions(id, token)
        .then(response => {
            const { captions } = response.data;
            this.setState({
                user,
                captions,
                loading: false,
            });
        })
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

    fetchUser = (id) => {
        return {
            user: {
                user_id: 2,
                username: 'tehblasian'
            }
        }
    }

    fetchUserCaptions = (id, token) => {
        const headers = { 
            'Authorization': `Bearer ${token}` 
        };
        return axios({
            method: 'get',
            url: `http://${process.env.REACT_APP_IP}:/api/captions?user-id=${id}&limit=5`,
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

        return <div className="user-contribution-container">
            <h1 className="header-username">{`${user.user.username}'s posts`}</h1>
            <div className="line-separator"></div>
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
                && <CaptionList captions={captions} token={token} onCaptionUpdate={this.onCaptionUpdate}/>
            }
        </div>
    }
}

export default UserContributionPage;