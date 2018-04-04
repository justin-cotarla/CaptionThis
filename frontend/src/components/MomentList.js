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
            page: 0,
        };
    };

    componentDidMount() {
        window.addEventListener('scroll', this.onScroll, false);
        this.onFilterChange(momentFilters[0]);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll, false);
    }

    onFilterChange = (selectedFilter) => {
        this.props.fetchMoments(selectedFilter, 0)
            .then(response => {
                const { moments } = response.data;
                this.setState({
                    moments,
                    selectedFilter,
                    loading: false,
                    page: 0,
                });
            })
            .catch(error => {
                this.setState({
                    error: 'Failed to load moments :( Please try again!',
                    loading: false,
                });
            });
    }

    onScroll = () => {
        var height = Math.max( document.body.scrollHeight, document.body.offsetHeight );

        if ((window.innerHeight + window.scrollY) >= (height - 500)
            && this.state.moments.length
            && !this.state.loading
            && this.state.page !== 'max') {

                this.setState({
                    loading: true,
                })

                const { page, selectedFilter, moments: oldMoments } = this.state;
                this.props.fetchMoments(selectedFilter, page + 1)
                .then(response => {
                    const { moments } = response.data;
                    this.setState({
                        moments: oldMoments.concat(moments),
                        selectedFilter,
                        loading: false,
                        page: moments.length ? page + 1 : 'max',
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

        return (
            <div className="moment-list-container">
                {
                    count > 0 && 
                    <h1 style={{fontSize: '26px', fontFamily: 'Teko', color: 'white', letterSpacing: '1px'}}>
                        {count} Moment{count > 1 ? 's' : ''}
                    </h1>
                }
                <ListFilter
                    filters={momentFilters}
                    selectedFilter={selectedFilter}
                    onFilterChange={this.onFilterChange}/>
                {
                    !loading && moments.length === 0 && <h1 style={{fontSize: '26px', fontFamily: 'Teko', color: 'white', letterSpacing: '1px'}}>
                        Looks like there's nothing here (yet) :(
                    </h1>
                }
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
                                        momentId={moment_id}/>
                                </li>
                            )
                        })
                    }
                </ul>
                {loading &&
                    <Loading/>
                }
            </div>
        )
    }
}

export default MomentList;
