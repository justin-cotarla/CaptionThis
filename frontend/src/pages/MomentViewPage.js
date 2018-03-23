import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import Moment from '../components/Moment';
import CaptionCreatorForm from '../components/CaptionCreatorForm';
import CaptionList from '../components/CaptionList';
import NavBar from '../components/NavBar';

import Loading from '../components/Loading';
import ErrorGraphic from '../components/ErrorGraphic';

import { fetchCaptionsByMomentId, getFilteredCaptionsByMoment } from '../util/apiUtil';

class MomentViewPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            token: null,
            moment: null,
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
                loading: false,
            });
        })
        .catch((error) => {
            console.log(error);
            this.setState({
                error: 'Oops! Something went wrong...'
            });
        });
    }

    onCaptionSubmit = (momentId) => {
        const CaptionList = this.CaptionList;
        CaptionList.forceUpdate();
    }

    render() {
        const { token, moment, loading, error } = this.state;
        const locationState = this.props.location.state;
        let scrollTo;
        if (locationState) {
            scrollTo = locationState.scrollTo;
        }
        
        if(error) {
            return (
                <div>
                    <NavBar user={this.state.user}/>
                    <ErrorGraphic message={error}/>
                </div>         
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
                        onCaptionSubmit={(momentId) => this.onCaptionSubmit(momentId)}
                        token={token}/>
                    <CaptionList
                        ref={(CaptionList) => this.CaptionList = CaptionList}
                        fetchCaptions={() => fetchCaptionsByMomentId(moment.moment_id, token)}
                        getFilteredCaptions={filter => getFilteredCaptionsByMoment(moment.moment_id, filter, token)}
                        showSubmittedBy={true}
                        showCount={true}
                        isLinkedToMoment={false}
                        scrollTo={scrollTo}
                        momentId={moment.moment_id}
                        momentCreatorId={moment.user.user_id}
                        user={this.props.user}
                        token={token}/>
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
