import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import Caption from './Caption';
import CaptionCreatorForm from './CaptionCreatorForm';
import Header from './Header';

import '../styles/CaptionList.css';
import Loading from './Loading';

class CaptionList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            captions: [],
            loading: true,
            token: null,
        };
    }

    componentDidMount(){
        const cookies = new Cookies();
        const token = cookies.get('token');
        if(token) {
            this.setState({
                token: cookies.get('token'),
            });
        }

        this.fetchCaptions();
    }

    handleVote = (event) => {
        const captionid = event.target.value;
        const action = event.target.id;
        const captions = this.state.captions;

        const caption = captions.filter(caption => caption.caption_id === captionid)[0];

        switch(action) {
            case '+': 
                if(caption.user_vote === 0 || caption.user_vote === -1){
                    axios.post(`http://${process.env.REACT_APP_IP}/api/captions/${captionid}`, { operation: 'vote', value: 1 }, {
                        headers: {'Authorization': `Bearer ${this.state.token}`}
                    })
                    .then(response => {
                        this.setState({
                            captions: captions.map(caption => {
                                if(caption.caption_id === captionid){
                                    return { ...caption, total_votes: response.data.votes, user_vote: 1 }
                                }

                                return caption;
                            })
                        })
                    })
                } else if(caption.user_vote === 1) {
                    axios.post(`http://${process.env.REACT_APP_IP}/api/captions/${captionid}`, { operation: 'vote', value: 0 }, {
                        headers: {'Authorization': `Bearer ${this.state.token}`}
                    })
                    .then(response => {
                        this.setState({
                            captions: captions.map(caption => {
                                if(caption.caption_id === captionid){
                                    return { ...caption, total_votes: response.data.votes, user_vote: 0 }
                                }

                                return caption;
                            })
                        })
                    })
                }           
            break;
            case '-': 
                if(caption.user_vote === 0 || caption.user_vote === 1){
                    axios.post(`http://${process.env.REACT_APP_IP}/api/captions/${captionid}`, { operation: 'vote', value: -1 }, {
                        headers: {'Authorization': `Bearer ${this.state.token}`}
                    })
                    .then(response => {
                        this.setState({
                            captions: captions.map(caption => {
                                if(caption.caption_id === captionid){
                                    return { ...caption, total_votes: response.data.votes, user_vote: -1 }
                                }

                                return caption;
                            })
                        })
                    })
                } else if(caption.user_vote === -1){
                    axios.post(`http://${process.env.REACT_APP_IP}/api/captions/${captionid}`, { operation: 'vote', value: 0 }, {
                        headers: {'Authorization': `Bearer ${this.state.token}`}
                    })
                    .then(response => {
                        this.setState({
                            captions: captions.map(caption => {
                                if(caption.caption_id === captionid){
                                    return { ...caption, total_votes: response.data.votes, user_vote: 0 }
                                }

                                return caption;
                            })
                        })
                    })
                } 
            break;
            default: break;
        }
    }

    handleAccept = (event) => {
        const captionid = event.target.value;
        const action = event.target.id;
        const captions = this.state.captions;

        const caption = captions.filter(caption => caption.caption_id === captionid)[0];

        switch(action) {
            case 'accept': 
                if(caption.selected === -1 || caption.selected === 0){
                    axios.post(`http://${process.env.REACT_APP_IP}/api/captions/${captionid}`, { operation: 'select', value: 1 }, {
                        headers: {'Authorization': `Bearer ${this.state.token}`}
                    })
                    .then(response => {
                        this.setState({
                            captions: captions.map(caption => {
                                if(caption.caption_id === captionid){
                                    return { ...caption, selected: 1 }
                                }

                                return caption;
                            })
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    });
                } else {
                    axios.post(`http://${process.env.REACT_APP_IP}/api/captions/${captionid}`, { operation: 'select', value: 0 }, {
                        headers: {'Authorization': `Bearer ${this.state.token}`}
                    })
                    .then(response => {
                        this.setState({
                            captions: captions.map(caption => {
                                if(caption.caption_id === captionid){
                                    return { ...caption, selected: 0 }
                                }

                                return caption;
                            })
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    });
                }  
            break;
            case 'reject': 
                if(caption.selected === 1 || caption.selected === 0){
                    axios.post(`http://${process.env.REACT_APP_IP}/api/captions/${captionid}`, { operation: 'select', value: -1 }, {
                        headers: {'Authorization': `Bearer ${this.state.token}`}
                    })
                    .then(response => {
                        this.setState({
                            captions: captions.map(caption => {
                                if(caption.caption_id === captionid){
                                    return { ...caption, selected: -1 }
                                }

                                return caption;
                            })
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    });
                } else {
                    axios.post(`http://${process.env.REACT_APP_IP}/api/captions/${captionid}`, { operation: 'select', value: 0 }, {
                        headers: {'Authorization': `Bearer ${this.state.token}`}
                    })
                    .then(response => {
                        this.setState({
                            captions: captions.map(caption => {
                                if(caption.caption_id === captionid){
                                    return { ...caption, selected: 0 }
                                }

                                return caption;
                            })
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    });
                }
            break;
            default: break;
        }
    }

    handleSubmit = (caption) => {
        const data = { content: caption, moment_id: this.props.momentId };
        if(this.state.token){
            axios.put(`http://${process.env.REACT_APP_IP}/api/captions`, data, {
                headers: {'Authorization': `Bearer ${this.state.token}`}
            })
            .then(() => this.fetchCaptions())
            .catch(error => {
                console.log(error);
            })
        }   
    }

    fetchCaptions = () => {
        axios.get(`http://${process.env.REACT_APP_IP}/api/captions?moment-id=${this.props.momentId}`)
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

    render(){
        const error = this.state.error;
        const loading = this.state.loading;
        const token = this.state.token;

        if(loading) {
            return (
                <div className="caption-list-container">
                    <CaptionCreatorForm handleSubmit={this.handleSubmit} authorized={token ? 'Submit' : 'Login to submit a caption'}/>
                    <Loading/>
                </div>
            )
        }
        
        if(error) {
            return ( 
                <div className="caption-list-container">
                    <CaptionCreatorForm handleSubmit={this.handleSubmit} authorized={token ? 'Submit' : 'Login to submit a caption'}/>
                    <Header textSize={3} text={error}/>
                </div>
            )
        }

        return (
            <div className="caption-list-container">
                <CaptionCreatorForm handleSubmit={this.handleSubmit} authorized={token ? 'Submit' : 'Login to submit a caption'}/>
                <ul>
                    {
                        this.state.captions.length > 0 ? <li><Header textSize={3} text={`${this.state.captions.length} Caption${this.state.captions.length > 1 ? 's' : ''}`}/></li> 
                        : <li><Header textSize={3} text="Looks like there's nothing here (yet) :("/></li>
                    }
                    { 
                        this.state.captions.map(caption => {
                            return <li key={caption.caption_id}>
                                <Caption 
                                id={caption.caption_id}
                                upvotes={caption.total_votes}
                                username={caption.user.username}
                                date={caption.date_added}
                                caption={caption.caption}
                                selected={caption.selected}
                                authorized={this.state.token}
                                voteHandler={this.handleVote}
                                acceptHandler={this.handleAccept}/>
                            </li>
                        })
                    
                    }
                </ul>    
            </div>
        )
    }
}

export default CaptionList;