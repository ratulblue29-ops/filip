import React, {useState} from 'react';
import {View, TouchableOpacity, Text, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from '../styles/BottomNavigationStyles';

const BottomNavigation = (): React.JSX.Element => {
  const [activeTab, setActiveTab] = useState('feed');
  const insets = useSafeAreaInsets();

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    console.log('Tab pressed:', tab);
  };

  return (
    <View
      style={[
        styles.wrapper,
        {paddingBottom: Platform.OS === 'ios' ? insets.bottom + 16 : 16},
      ]}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'feed' && styles.activeTabButton,
          ]}
          onPress={() => handleTabPress('feed')}
          activeOpacity={0.7}>
          <Icon
            name="home-outline"
            size={25}
            color={activeTab === 'feed' ? '#fff' : '#999'}
          />
          {activeTab === 'feed' && (
            <Text style={styles.activeTabLabel}>Feed</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'findjobs' && styles.activeTabButton,
          ]}
          onPress={() => handleTabPress('findjobs')}
          activeOpacity={0.7}>
          <Icon
            name="compass-outline"
            size={27}
            color={activeTab === 'findjobs' ? '#fff' : '#999'}
          />
          {activeTab === 'findjobs' && (
            <Text style={styles.activeTabLabel}>Find Jobs</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'fulltime' && styles.activeTabButton,
          ]}
          onPress={() => handleTabPress('fulltime')}
          activeOpacity={0.7}>
          <View style={styles.iconContainer}>
            <Icon
              name="briefcase-outline"
              size={25}
              color={activeTab === 'fulltime' ? '#fff' : '#999'}
            />
            <Icon
              name="search-outline"
              size={17}
              color={activeTab === 'fulltime' ? '#fff' : '#999'}
              style={styles.searchOverlay}
            />
          </View>
          {activeTab === 'fulltime' && (
            <Text style={styles.activeTabLabel}>Full-Time</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'profile' && styles.activeTabButton,
          ]}
          onPress={() => handleTabPress('profile')}
          activeOpacity={0.7}>
          <Icon
            name="person-outline"
            size={25}
            color={activeTab === 'profile' ? '#fff' : '#999'}
          />
          {activeTab === 'profile' && (
            <Text style={styles.activeTabLabel}>Profile</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomNavigation;