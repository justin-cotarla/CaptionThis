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
        const { count } = this.props;

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
                {
                    moments.length === 0 
                        ? <Header textSize={4} text="Looks like there's nothing here (yet) :("/>
                        : count && <h1 style={{fontSize: '26px', fontFamily: 'Teko', color: 'white', letterSpacing: '1px'}}>{count} Moments</h1>

                }
                <ListFilter
                    filters={momentFilters}
                    selectedFilter={selectedFilter}
                    onFilterChange={this.onFilterChange}/>
                <ul className="Moments-list">
                    {
                        moments.map(moment => {
                            const {
                                moment_id,
                                img,
                                date_added,
                                top_caption,
                                user,
                            } = moment;
                            return (
                                <li key={moment_id}>
                                    <Moment className="Moment-component"
                                        showSubmittedBy={this.props.showSubmittedBy}
                                        image={ img }
                                        date={ date_added }
                                        description= {
                                            top_caption
                                                ? top_caption
                                                : 'Submit a caption'
                                            }

                                        user={ {...user} }
                                        momentId={moment_id}
                                        currentUser={ this.props.user }
                                        token = {this.props.token} />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}

export default MomentList;
