import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import AvailabilityScreen from '../screen/availabilty/AvailabiltyScreen';
import SeasonAvailabiltyScreen from '../screen/seasonAvailabilty/SeasonAvailabiltyScreen';
import DailyAvailabilityScreen from '../screen/dailyAvailability/DailyAvailabilityScreen';

// export type FindWorkersStackParamList = {
//   FindJobsHome: undefined;
//   Seasonal: undefined;
//   Daily: undefined;
// };
export type FindWorkersStackParamList = {
  Seasonal: undefined;
  Daily: undefined;
};

const Stack = createNativeStackNavigator<FindWorkersStackParamList>();

const FindWorkersStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="FindJobsHome" component={AvailabilityScreen} /> */}
      <Stack.Screen name="Seasonal" component={SeasonAvailabiltyScreen} />
      <Stack.Screen name="Daily" component={DailyAvailabilityScreen} />
    </Stack.Navigator>
  );
};

export default FindWorkersStack;
