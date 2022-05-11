import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  ExampleContainer,
  SearchContainer,
  NewsContainer,
  MarketContainer,
} from '@/Containers'
import IconBells from '../Assets/icons/icon-bells.svg'
import IconNews from '../Assets/icons/icon-news.svg'
import IconMarket from '../Assets/icons/icon-calculator.svg'
import IconDirection from '../Assets/icons/icon-direction.svg'
import IconSearh from '../Assets/icons/icon-search.svg'

const Tab = createBottomTabNavigator()

// @refresh reset
const MainNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="News">
      <Tab.Screen
        name="Search"
        component={SearchContainer}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return <IconSearh width={20} height={20} />
          },
          tabBarLabelPosition: 'beside-icon',
          tabBarIconStyle: {marginRight: -10},
          tabBarLabel: 'Search',
        }}
      />
      <Tab.Screen
        name="Markets"
        component={MarketContainer}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return <IconMarket width={20} height={20} />
          },
          tabBarLabelPosition: 'beside-icon',
          tabBarIconStyle: {marginRight: -10},
          tabBarLabel: 'Markets',
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsContainer}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return <IconNews width={20} height={20} />
          },
          tabBarLabelPosition: 'beside-icon',
          tabBarIconStyle: {marginRight: -10},
          tabBarLabel: 'News',
        }}
      />
      <Tab.Screen
        name="Portfolio"
        component={ExampleContainer}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return <IconDirection width={20} height={20} />
          },
          tabBarLabelPosition: 'beside-icon',
          tabBarIconStyle: {marginRight: -10},
          tabBarLabel: 'Portfolio',
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={ExampleContainer}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return <IconBells width={20} height={20} />
          },
          tabBarLabelPosition: 'beside-icon',
          tabBarIconStyle: {marginRight: -10},
          tabBarLabel: 'Notify',
        }}
      />
    </Tab.Navigator>
  )
}

export default MainNavigator
