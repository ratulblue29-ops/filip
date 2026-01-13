import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FeedScreen from '../screen/feed/FeedScreen';
import ChatScreen from '../screen/chat/ChatScreen';
import Profile from '../screen/profile/Profile';
import CustomTabBar from '../components/CustomTabBar';
import FindJobsStack from './FindJobsStack';

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
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
