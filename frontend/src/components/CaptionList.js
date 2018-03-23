import React from 'react';
import { Link } from 'react-router-dom';
import CaptionFilter from '../components/CaptionFilter';
import Caption from './Caption';
import Header from './Header';
import ErrorGraphic from './ErrorGraphic';

import '../styles/CaptionList.css';

const ConditionalWrap = ({condition, wrap, children}) => condition ? wrap(children) : children;

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
        this.props.fetchCaptions()
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

    onFilterChange = (selectedFilter) => {
        const currentFilter = this.state.selectedFilter;
        if (selectedFilter !== currentFilter) {
            this.setState({ 
                scrolled: true, 
                loading: true, 
            });
            this.props.getFilteredCaptions(selectedFilter)
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

    render () {
        const { captions, selectedFilter, scrolled, loading, error } = this.state;
        const { user, momentCreatorId, showSubmittedBy, showCount, isLinkedToMoment, scrollTo, token } = this.props;

        if (error) {
            return <div className="caption-list-container">
                    <ErrorGraphic/>
            </div>
        }

        return ( 
            <div className="caption-list-container">
                {
                    showCount && (
                        captions.length > 0 ? <Header textSize={4} text={`${captions.length} Caption${captions.length > 1 ? 's' : ''}`}/>
                                            : <Header textSize={4} text="Looks like there's nothing here (yet) :("/>
                    )
                }
                <CaptionFilter selectedFilter={selectedFilter} onFilterChange={this.onFilterChange}/>
                <ul>
                    { 
                        captions.map(caption => {
                            return <li key={caption.caption_id} style={isLinkedToMoment ? {cursor: 'pointer'} : {}}>
                                <ConditionalWrap
                                    condition={isLinkedToMoment}
                                    wrap={children => <Link className="linked-caption" to={{pathname: `/moment/${caption.moment_id}`, state: { scrollTo: caption.caption_id}}}>{children}</Link>}
                                >
                                    <Caption 
                                        scrollTo={scrolled === false ? scrollTo : -1}
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
