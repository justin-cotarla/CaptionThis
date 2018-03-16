import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import Moment from '../components/Moment';
import CaptionCreatorForm from '../components/CaptionCreatorForm';
import CaptionList from '../components/CaptionList';
import NavBar from '../components/NavBar';

import Header from '../components/Header';
import Loading from '../components/Loading';
import ErrorGraphic from '../components/ErrorGraphic';

class MomentViewPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            token: null,
            moment: null,
            captions: [],
            loading: true,
            user: props.user,
            error: null,
        };
    };

    componentDidMount(){
        const cookies = new Cookies();
        const token = cookies.get('token');

        if(token) {
            this.setState({
                token: cookies.get('token'),
            });
        }

        const momentID = this.props.match.params.momentID;
        axios({
            method: 'get',
            url: `http://${process.env.REACT_APP_IP}/api/moments/${momentID}`
        })
        .then((response) => {
            let moment = response.data.moment;
            this.setState({
                moment,
            });
        })
        .then(() => this.fetchCaptions(momentID))
        .catch((error) => {
            console.log(error);
            this.setState({
                error: 'Oops! Something went wrong...'
            });
        });
    }

    fetchCaptions = (momentid) => {
        const token = this.state.token;
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        axios({
            method: 'get',
            url: `http://${process.env.REACT_APP_IP}/api/captions?moment-id=${momentid}`,
            headers: token ? headers : {}
        })
        .then(response => {
            this.setState({
                captions: response.data.captions,
                loading: false,
            });
        })
        .catch(error => {
            console.log(error);
            this.setState({
                error,
                loading: false,
            });
        })
    }

    // A callback to update the caption list after a vote or acception/rejection
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

    render() {
        const { token, moment, captions, loading, error } = this.state;
        if(error) {
            return (
                <ErrorGraphic error_message={error}/>
            )
        }

        if(loading) {
            return (
                <Loading/>
            )
        }

        return (
            <div>
            <NavBar user={this.state.user}/>
            <div className="moment-view-container">
                <Moment
                    image={ moment.img_url }
                    date={ formatDate(moment.date_added) }
                    description={ moment.description }
                    showSubmittedBy={ true }
                    username={ moment.user.username }/>
                <CaptionCreatorForm
                    momentId={this.props.match.params.momentID}
                    onCaptionSubmit={this.fetchCaptions}
                    token={token}/>
                <CaptionList
                    captions={captions}
                    showSubmittedBy={true}
                    isLinkedToMoment={false}
                    momentCreatorId={moment.user_id}
                    user={this.props.user}
                    token={token}
                    onCaptionUpdate={this.onCaptionUpdate}>
                    {
                        captions.length > 0 ? <Header textSize={3} text={`${captions.length} Caption${captions.length > 1 ? 's' : ''}`}/>
                        : <Header textSize={3} text="Looks like there's nothing here (yet) :("/>
                    }
                </CaptionList>
            </div>
            </div>
        )
    }
}

// Exact formatting of date will be handled later
const formatDate = date => {
    return date.split('T')[0];
}

export default MomentViewPage;
