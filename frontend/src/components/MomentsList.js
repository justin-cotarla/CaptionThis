import React, {Component} from 'react';
import Moment from './Moment';
import '../styles/MomentsList.css';

class MomentsList extends Component {
    viewMoment() {
        console.log("clicked");
    }
    
    render() {
        return (
            <ul className="Moments-list">
                {
                    this.props.Moments && this.props.Moments.map(moment => {
                        return (
                            <li key={moment.moment_id}>
                                <Moment onClick={this.viewMoment} Image={ moment.img } Date={ formatDate(moment.date_added) } Description={ moment.description } User={ moment.user_id }/>
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
