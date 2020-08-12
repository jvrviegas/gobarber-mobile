import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

import SelectProvider from './pages/New/SelectProvider';
import SelectDateTime from './pages/New/SelectDateTime';
import Confirm from './pages/New/Confirm';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

const tabBarOptions = {
  keyboardHidesTabBar: true,
  activeTintColor: '#fff',
  inactiveTintColor: 'rgba(255, 255, 255, 0.6)',
  size: 20,
  labelStyle: {
    fontSize: 14,
    marginBottom: 10,
  },
  style: {
    height: 70,
    backgroundColor: '#8d41a8',
  },
};

function NewAppointment() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTintColor: '#fff',
        headerLeftContainerStyle: {
          marginLeft: 20,
        },
      }}
    >
      <Stack.Screen
        name="SelectProvider"
        component={SelectProvider}
        options={SelectProvider.navigationOptions}
      />
      <Stack.Screen
        name="SelectDateTime"
        component={SelectDateTime}
        options={SelectDateTime.navigationOptions}
      />
      <Stack.Screen
        name="Confirm"
        component={Confirm}
        options={Confirm.navigationOptions}
      />
    </Stack.Navigator>
  );
}

function Routes() {
  const signed = useSelector((state) => state.auth.signed);

  return (
    <NavigationContainer>
      {signed ? (
        <BottomTab.Navigator tabBarOptions={tabBarOptions}>
          <BottomTab.Screen
            name="Dashboard"
            component={Dashboard}
            options={Dashboard.navigationOptions}
          />

          <BottomTab.Screen
            name="New"
            component={NewAppointment}
            options={{
              unmountOnBlur: true,
              tabBarVisible: false,
              tabBarLabel: 'Agendar',
              tabBarIcon: () => (
                <Icon
                  name="add-circle-outline"
                  size={20}
                  color="rgba(255, 255, 255, 0.6)"
                />
              ),
            }}
          />

          <BottomTab.Screen
            name="Profile"
            component={Profile}
            options={Profile.navigationOptions}
          />
        </BottomTab.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ title: 'Login', headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ title: 'Registrar', headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default Routes;
