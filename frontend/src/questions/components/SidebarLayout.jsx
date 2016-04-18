/* eslint "react/prop-types": "warn" */
import React, { Component, PropTypes } from "react";

const SidebarLayout = ({ className, style, sidebar, children }) =>
    <div className={className} style={{ ...style, display: "flex", flexDirection: "row", overflow: "hidden" }}>
        { React.cloneElement(
            sidebar,
            { style: { flexShrink: 0, overflowY: 'scroll' },
              className: 'scroll-show'
            },
            sidebar.props.children
        )}
        { children && React.cloneElement(
            React.Children.only(children),
            { style: { flex: 1, overflowY: 'scroll' }},
            React.Children.only(children).props.children
        )}
    </div>

SidebarLayout.propTypes = {
    className:  PropTypes.string,
    style:      PropTypes.object,
    sidebar:    PropTypes.element.isRequired,
    children:   PropTypes.element.isRequired,
};

export default SidebarLayout;