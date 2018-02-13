import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import Moment from './Moment';
import '../styles/MomentsList.css';

class MomentsList extends Component {

    constructor(props){
        super(props);
        this.state = {
            switchPages: false,
        };
    };

    viewMoment(moment) {
        this.setState({redirect: true});
        console.log(this.state.redirect);
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to="/momentview/momentID" />;
        }

        return (
            <ul className="Moments-list">
                {
                    this.props.Moments && this.props.Moments.map(moment => {
                        return (
                            <li key={moment.moment_id}>
                                <Moment onClick={() => this.viewMoment(moment)} Image={ moment.img } Date={ formatDate(moment.date_added) } Description={ moment.description } User={ moment.user_id }/>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
}

// Exact formatting of date will be handled later
const formatDate = date => {
    return date.split('T')[0];
}

export default MomentsList;
