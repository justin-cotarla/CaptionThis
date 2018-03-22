import React, { Component } from 'react';

class Header extends Component{
    render() {
        let size = this.props.textSize;
        let headerStyle = { fontSize: '10px', };
        switch (size) {
            case 2:
                headerStyle.fontSize = '24px';
                break;
            case 3:
                headerStyle.fontSize = '20px';
                break;
            case 4:
                headerStyle.fontSize = '24px';
                break;
            default:
                headerStyle.fontSize = '12px';
        }
        return (
        <h1 style={headerStyle}>{this.props.text}</h1>
        )
    }
}
export default Header;
