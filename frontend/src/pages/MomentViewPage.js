import React, { Component } from 'react';
import axios from 'axios';
import Moment from '../components/Moment';
import CaptionList from '../components/CaptionList';
import Header from '../components/Header';
import Loading from '../components/Loading';

class MomentViewPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            moment: null,
            error: null,
        };
    };
    
    componentWillMount(){
        const momentID = this.props.match.params.momentID;
        
        axios.get(`http://${process.env.REACT_APP_IP}/api/moments/${momentID}`)
        .then((response) => {
            let moment = response.data.moment;
            this.setState({
                moment,
            });
        })
        .catch((error) => {
            console.log(error);
            this.setState({
                error: 'Oops! Something went wrong...'
            });
        });
    }
    
    render() {
        const moment = this.state.moment;
        const error = this.state.error;
        
        if (error) {
            return (
                <div>
                <Header textSize={4} text={error} />
                </div>
            )
        }
        
        if (moment) {
            return (
                <div className="moment-view-container">
                <Moment image={ moment.img_url } date={ formatDate(moment.date_added) } description={ moment.description } user={ moment.user_id }/>
                <CaptionList momentId={this.props.match.params.momentID}/>
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