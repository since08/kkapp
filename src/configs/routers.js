import {Actions, Scene, ActionConst, Tabs} from 'react-native-router-flux';
import React from 'react';
import TabHomePage from '../pages/navigation/TabHomePage';

export const Stacks = Actions.create(<Scene key="root">
  <Scene key="TabHomePage" component={TabHomePage} hideNavBar/>
</Scene>)