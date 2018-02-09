import React, { Component } from 'react';

class Header extends Component{
    render() {
        var size = this.props.textSize;
        var headerStyle = {
            fontSize: '12px',
          };

        if (size === 2) {
            headerStyle.fontSize = '16px'
        } else if (size === 3) {
            headerStyle.fontSize = '20px'
        } else if (size === 4) {
            headerStyle.fontSize = '24px'
        }

        return (
        <h style={headerStyle}>{this.props.text}</h>
        )
    }   
}

export default Header;