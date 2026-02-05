import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FeedScreen from '../screen/feed/FeedScreen';
import CustomTabBar from '../components/CustomTabBar';
import FindJobsStack from './FindJobsStack';
import FulltimeScreen from '../screen/fulltime/FulltimeScreen';
import MainProfile from '../screen/profile/MainProfile';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="FindJobs" component={FindJobsStack} />
      <Tab.Screen name="fulltime" component={FulltimeScreen} />
      <Tab.Screen name="Profile" component={MainProfile} />
    </Tab.Navigator>
  );
}
