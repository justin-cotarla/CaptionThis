import React from 'react';
import { Link } from 'react-router-dom';
import scrollToComponent from 'react-scroll-to-component';
import ListFilter from '../components/ListFilter';
import Caption from './Caption';
import Header from './Header';
import ErrorGraphic from './ErrorGraphic';
import ConditionalWrap from './ConditionalWrap';

import { captionFilters } from '../util/ApiUtil';

import '../styles/CaptionList.css';

class CaptionList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            captions: [],
            selectedFilter: 'Recent',
            scrolled: false,
            loading: true,
            error: '',
        }
    }

    componentDidMount() {
        this.fetchCaptions();
    }

    componentWillUnmount() {
        clearInterval(this.scrollTimeout);
    }

    componentDidUpdate = () => {
        const { captions, scrolled } = this.state;
        if (captions.length && !scrolled) {
            this.scrollToCaption();
        }
    }

    fetchCaptions = () => {
        this.props.fetchCaptions(this.state.selectedFilter)
        .then(response => {
            const { captions } = response.data;
            this.setState({
                captions,
                loading: false,
            })
        })
        .catch(error => {
            this.setState({
                error: 'Failed to load captions :( Please try again!',
                loading: false,
            });
        });
    }

    scrollToCaption = () => {
        const { scrollTo } = this.props;
        const captionRef = this.refs[scrollTo];
        scrollToComponent(captionRef, {
            offset: -100,
            align: 'top',
            duration: 1000
        });
        if (this.state.scrolled === false) {
            this.scrollTimeout = setTimeout(() => this.setState({ scrolled: true }), 5000);
        }
    }

    onFilterChange = (selectedFilter) => {
        const currentFilter = this.state.selectedFilter;
        if (selectedFilter !== currentFilter) {
            this.props.fetchCaptions(selectedFilter)
            .then(response => {
                const { captions } = response.data;
                this.setState({ 
                    captions, 
                    selectedFilter,
                });
            })
        }
    }

    render () {
        const { captions, selectedFilter, scrolled, loading, error } = this.state;
        const { user, momentCreatorId, showSubmittedBy, count, isLinkedToMoment, scrollTo, isInteractive, token } = this.props;

        if (error) {
            return <div className="caption-list-container">
                    <ErrorGraphic/>
            </div>
        }

        return ( 
            <div className="caption-list-container">
                {
                    count > 0 && 
                    <h1 style={{fontSize: '26px', fontFamily: 'Teko', color: 'white', letterSpacing: '1px'}}>
                        {count} Caption{count > 1 ? 's' : ''}
                    </h1>
                }
                <ListFilter filters={captionFilters} selectedFilter={selectedFilter} onFilterChange={this.onFilterChange}/>
                {
                    !loading && captions.length === 0 && <h1 style={{fontSize: '26px', fontFamily: 'Teko', color: 'white', letterSpacing: '1px'}}>
                        Looks like there's nothing here (yet) :(
                    </h1>
                }
                <ul>
                    { 
                        captions.map(caption => {
                            return <li key={caption.caption_id} style={isLinkedToMoment ? {cursor: 'pointer'} : {}}>
                                <ConditionalWrap
                                    condition={isLinkedToMoment}
                                    wrap={children => <Link className="linked-caption" to={{pathname: `/moment/${caption.moment_id}`, state: { scrollTo: caption.caption_id}}}>{children}</Link>}
                                >
                                    <Caption 
                                        ref={caption.caption_id}
                                        caption={caption} 
                                        scrollTo={scrolled === false ? scrollTo : -1}
                                        showSubmittedBy={showSubmittedBy}
                                        canAccept={
                                            (user) // The user is logged on
                                            && (momentCreatorId === user.id) // The logged-on user created the moment
                                            && (user.id !== caption.user.id) // The logged-on user did not create the caption
                                        } 
                                        canEdit={user && isInteractive && (user.id === caption.user.id)}
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
