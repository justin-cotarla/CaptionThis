import React, { Component } from 'react';
import axios from 'axios';
import Moment from '../components/Moment';
import Header from '../components/Header';

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

      axios.get(`http://${process.env.REACT_APP_IP}:16085/api/moments/${momentID}`).then(response => {
        let moment = response.data.moment;
        this.setState({
          moment,
        });
      }).catch(error => {
        console.log(error);
        this.setState({
          error: 'Oops! Something went wrong...'
        });
      });
    };

    render() {
      const moment = this.state.moment;
      const error = this.state.error;

      if (error) {
        return (<div>
        <Header textSize={4} text={error} />
        </div>);
      } else if (moment) {
        return (
          <Moment Image={ moment.img_url } Date={ formatDate(moment.date_added) } Description={ moment.description } User={ moment.user_id }/>
        );
      } else {
        return <h1>MOMENTVIEW</h1>
      }
    }
  }

// Exact formatting of date will be handled later
const formatDate = date => {
  return date.split('T')[0];
}

export default MomentViewPage;