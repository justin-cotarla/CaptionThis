import React, { Component } from 'react';
import ListFilter from './ListFilter';
import Moment from './Moment';
import Header from './Header';
import Loading from './Loading';
import ErrorGraphic from './ErrorGraphic';

import { momentFilters } from '../util/ApiUtil';
import '../styles/MomentsList.css';

class MomentList extends Component {
    constructor(props){
        super(props);
        this.state = {
            moments: [],
            selectedFilter: '',
            switchPages: false,
            loading: true,
            error: '',
        };
    };

    componentDidMount() { 
        this.onFilterChange(momentFilters[0]);
    }

    onFilterChange = (selectedFilter) => {
        const currentFilter = this.state.selectedFilter;
        if (selectedFilter !== currentFilter) {
            this.props.fetchMoments(selectedFilter)
            .then(response => {
                const { moments } = response.data;
                this.setState({ 
                    moments, 
                    selectedFilter,
                    loading: false,
                });
            })
            .catch(error => {
                this.setState({
                    error: 'Failed to load moments :( Please try again!',
                    loading: false,
                });
            });
        }
    }

    render() {
        const { selectedFilter, moments, loading, error } = this.state;
        const { showCount } = this.props;

        if (error) {
            return <div className="moment-list-container">
                        <ErrorGraphic message={error}/>
                </div>
        }

        if (loading) {
            return <Loading/>
        }
        
        return (
            <div className="moment-list-container">
                <ListFilter 
                    filters={momentFilters} 
                    selectedFilter={selectedFilter} 
                    onFilterChange={this.onFilterChange}/>
                {
                    (showCount && moments.length === 0) && <Header textSize={4} text="Looks like there's nothing here (yet) :("/>
                }
                <ul className="Moments-list">
                    {
                        moments.map(moment => {
                            return (
                                <li key={moment.moment_id}>
                                    <Moment className="Moment-component"
                                        showSubmittedBy={this.props.showSubmittedBy}
                                        image={ moment.img }
                                        date={ formatDate(moment.date_added) }
                                        description= {
                                            moment.top_caption 
                                                ? `"${(moment.top_caption.length > 30) ? moment.top_caption.slice(0, 30).concat('...') : moment.top_caption}"`
                                                : 'Submit a caption'
                                            }
                                        username={ moment.user.username }
                                        momentId={moment.moment_id}/>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}

// Exact formatting of date will be handled later
const formatDate = date => {
    return date.split('T')[0];
}

export default MomentList;
