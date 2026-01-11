import React from 'react';
import {View, FlatList} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../components/Header';
import RecommendedSection from '../components/RecommendedSection';
import NewestGigsSection from '../components/NewestGigsSection';
import BottomNavigation from '../components/BottomNavigation';
import {styles} from '../styles/FeedScreenStyles';

const FeedScreen = (): React.JSX.Element => {
  const insets = useSafeAreaInsets();

  // Dummy data array with single item to use FlatList
  const sections = [{id: 'content'}];

  const renderContent = () => (
    <>
      <Header />
      <RecommendedSection />
      <NewestGigsSection />
    </>
  );

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <FlatList
        data={sections}
        renderItem={renderContent}
        keyExtractor={item => item.id}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      />
      <BottomNavigation />
    </View>
  );
};

export default FeedScreen;