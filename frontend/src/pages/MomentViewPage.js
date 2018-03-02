import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import Moment from '../components/Moment';
import CaptionCreatorForm from '../components/CaptionCreatorForm';
import CaptionList from '../components/CaptionList';

import Header from '../components/Header';
import Loading from '../components/Loading';

class MomentViewPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            token: null,
            moment: null,
            captions: [],
            loading: true,
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
        const token = this.state.token;
        const moment = this.state.moment;
        const error = this.state.error;
        
        if(error) {
            return (
                <div>
                <Header textSize={4} text={error} />
                </div>
            )
        }
        
        if(moment) {
            return (
                <div className="moment-view-container">
                <Moment image={ moment.img_url } date={ formatDate(moment.date_added) } description={ moment.description } user={ moment.user_id }/>
                <CaptionCreatorForm momentId={this.props.match.params.momentID} onCaptionSubmit={this.fetchCaptions} token={token}/>
                <CaptionList captions={this.state.captions} token={token} onCaptionUpdate={this.onCaptionUpdate}/>
                </div>
            )
        }
        else {
            return <Loading />
        }
        
    } 
}

// Exact formatting of date will be handled later
const formatDate = date => {
    return date.split('T')[0];
}

export default MomentViewPage;