import React from 'react';
import ListFilter from './ListFilter';
import '../styles/DropdownListFilter.css';

class DropdownListFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDropdown: false,
        }
    }

    onFilterChange = filter => {
        this.setState({ showDropdown: false });
        this.props.onFilterChange(filter);
    }

    showDropdown = event => {
        event.preventDefault();
        this.setState(prevState => ({
            showDropdown: !prevState.showDropdown,
        }))
    }

    render() {
        const { showDropdown } = this.state;
        const dropdownIsVisible = showDropdown ? '' : 'hide-dropdown';
        return (
            <div className="dropdown-list-filter">
                <span>{this.props.selectedFilter}</span>
                <div 
                    className="dropdown-filter-arrow" 
                    style={showDropdown ? {transform: 'rotate(-135deg)', marginBottom: 0} : null} 
                    onClick={this.showDropdown}/>
                <span className={dropdownIsVisible}>
                    <div className="dropdown-triangle-up"></div>
                    <ListFilter 
                        filters={this.props.filters} 
                        selectedFilter={this.props.selectedFilter}
                        onFilterChange={this.onFilterChange}/>
                </span>
            </div>
        )
    }   
}

export default DropdownListFilter;
