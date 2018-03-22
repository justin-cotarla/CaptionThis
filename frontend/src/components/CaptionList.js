import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CaptionFilter from '../components/CaptionFilter';
import Caption from './Caption';
import LoadingDots from './LoadingDots';
import ErrorGraphic from './ErrorGraphic';
import '../styles/CaptionList.css';

const ConditionalWrap = ({condition, wrap, children}) => condition ? wrap(children) : children;

class CaptionList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            captions: [],
            selectedFilter: 'Recent',
            loading: true,
            error: '',
        }
    }

    componentDidMount() {
        this.fetchCaptions(this.props.momentId)
        .then(response => {
            const { captions } = response.data;
            this.setState({ 
                captions,
                loading: false,
            })
        })
        .catch(error => {
            console.log(error);
            this.setState({
                error: 'Failed to load captions :( Please try again!',
                loading: false,
            });
        });
    }

    fetchCaptions = (momentid) => {
        const token = this.props.token;
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        return axios({
            method: 'get',
            url: `http://${process.env.REACT_APP_IP}/api/captions?moment-id=${momentid}`,
            headers: token ? headers : {}
        })
    }

    onFilterChange = (selectedFilter) => {
        const currentFilter = this.state.selectedFilter;
        if (selectedFilter !== currentFilter) {
            this.setState({ loading: true });
            setTimeout(10000)
            this.getFilteredCaptions(selectedFilter)
            .then(response => {
                const { captions } = response.data;
                this.setState({ 
                    captions, 
                    selectedFilter,
                    loading: false,
                });
            })
        }
    }

    getFilteredCaptions = (filter) => {
        const { token } = this.props;
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        
        const { momentId } = this.props;
        let filterQuery = `?moment-id=${momentId}`;
        switch (filter) {
            case 'Oldest':
                filterQuery = filterQuery.concat('&order=asc');
                break;
            case 'Top':
                filterQuery = filterQuery.concat('&filter=votes');
                break;
            case 'Worst':
                filterQuery = filterQuery.concat('&filter=votes&order=asc');
                break;
            case 'Accepted': 
                filterQuery = filterQuery.concat('&filter=acceptance');
                break;
            case 'Rejected':
                filterQuery = filterQuery.concat('&filter=acceptance&order=asc');
                break;
            default: break;
        }

        return axios({
            method: 'get',
            url: `http://${process.env.REACT_APP_IP}/api/captions${filterQuery}`,
            headers: token ? headers : {}
        })
    }

    render () {
        const { captions, selectedFilter, loading, error } = this.state;
        const { user, momentCreatorId, showSubmittedBy, isLinkedToMoment, scrollTo, token } = this.props;
        const loadingListStyle = {
            opacity: '0',
        }

        if (error) {
            return <div className="caption-list-container">
                    <ErrorGraphic/>
            </div>
        }

        return ( 
            <div className="caption-list-container">
                { this.props.children }
                <CaptionFilter selectedFilter={selectedFilter} onFilterChange={this.onFilterChange}/>
                { loading && (
                        <div className="fetching-captions-filtered">
                            <LoadingDots/>
                        </div> 
                    )
                }
                <ul style={ loading ? loadingListStyle : {opacity: 1, transition: 'opacity 300ms ease-in-out'}}>
                    { 
                        captions.map(caption => {
                            return <li key={caption.caption_id} style={isLinkedToMoment ? {cursor: 'pointer'} : {}}>
                                <ConditionalWrap
                                    condition={isLinkedToMoment}
                                    wrap={children => <Link className="linked-caption" to={{pathname: `/moment/${caption.moment_id}`, state: { scrollTo: caption.caption_id}}}>{children}</Link>}
                                >
                                    <Caption 
                                        scrollTo={scrollTo}
                                        caption={caption} 
                                        showSubmittedBy={showSubmittedBy}
                                        canAccept={
                                            (user) // The user is logged on
                                            && (momentCreatorId === user.id) // The logged-on user created the moment
                                            && (user.id !== caption.user.user_id) // The logged-on user did not create the caption
                                        } 
                                        token={token} />
                                </ConditionalWrap>
                            </li>
                        })                  
                    }
                </ul>    
            </div>
        )
    }
}

export default CaptionList;
