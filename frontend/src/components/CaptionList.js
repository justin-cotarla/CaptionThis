import React from 'react';
import Caption from './Caption';

class CaptionList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            captions: [],
            error: '',
        };
    }

    handleVote = (event) => {
        console.log(event.target.id);
    }

    render(){
        return (
            <Caption upvotes={0} username='tehblasian' date='February 14, 2018' caption='Making my way downtown!' handler={this.handleVote}/>
        )
    }
}

export default CaptionList;