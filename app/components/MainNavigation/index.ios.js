/*
 *
 * MainNavigation
 *
 */

import { View } from 'react-native';
import React, { Component } from 'react';
import styles from './styles';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { selectMainNavigation } from './reducer';
import { TabBarIOS, NavigationExperimental } from 'react-native';
import TodoList from '../TodoList';

const { Reducer: NavigationReducer } = NavigationExperimental;
const { JumpToAction } = NavigationReducer.TabsReducer;

class MainNavigation extends Component {
  render() {
    const children = this.props.mainNavigation.children.map( (tab, i) => {
      return (
        <TabBarIOS.Item key={tab.key}
            icon={tab.icon}
            selectedIcon={tab.selectedIcon}
            title={tab.title} onPress={
              () => this.props.onNavigate(JumpToAction(i))
            }
            selected={this.props.mainNavigation.index === i}>
            { this._renderTabContent(tab) }
        </TabBarIOS.Item>
      );
    });
    return (
      <TabBarIOS>
        {children}
      </TabBarIOS>
    );
  }

  _renderTabContent(tab) {
    return (
      <View style={ styles.container }>
        <TodoList filter={tab.key} />
      </View>
    );
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, dispatchProps, stateProps, {
    onNavigate: (action) => {
      dispatchProps.dispatch(
        Object.assign(action, {
          scope: action.scope || stateProps.mainNavigation.key
        })
      );
    }
  });
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(
  createSelector(selectMainNavigation, (mainNavigation) => ({ mainNavigation })),
  mapDispatchToProps, mergeProps
)(MainNavigation);
