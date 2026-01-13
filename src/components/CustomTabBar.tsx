import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import HomeIcon from '../components/svg/HomeIcon';
import ExploreIcon from '../components/svg/ExploreIcon';
import ChatIcon from '../components/svg/ChatIcon';
import ProfileIcon from '../components/svg/ProfileIcon';

const ICONS: any = {
  Feed: HomeIcon,
  FindJobs: ExploreIcon,
  fulltime: ChatIcon,
  Profile: ProfileIcon,
};

export default function CustomTabBar({ state, navigation }: any) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {state.routes.map((route: any, index: number) => {
          const focused = state.index === index;
          const Icon = ICONS[route.name];

          return (
            <TouchableOpacity
              key={route.key}
              style={[styles.tab, focused && styles.activeTab]}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.8}
            >
              <Icon size={24} color={focused ? '#FFFFFF' : '#9CA3AF'} />

              {focused && (
                <Text style={styles.label}>
                  {focused && (
                    <Text style={styles.label}>
                      {route.name === 'FindJobs'
                        ? 'Find Jobs'
                        : route.name === 'fulltime'
                        ? 'Full-Time'
                        : route.name}
                    </Text>
                  )}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 25,
    left: 16,
    right: 16,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 24,
  },
  activeTab: {
    backgroundColor: '#000000',
  },
  label: {
    color: '#FFFFFF',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'InterDisplayMedium',
  },
});
