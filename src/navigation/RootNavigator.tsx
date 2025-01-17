import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import EntryDetailScreen from '../screens/EntryDetailScreen';
import HomeScreen from '../screens/HomeScreen';
import NewEntryScreen from '../screens/NewEntryScreen';
import StatsScreen from '../screens/StatsScreen';
import { theme } from '../styles/theme';

export type RootStackParamList = {
	Home: undefined;
	NewEntry: undefined;
	EntryDetail: { entryId: string };
	Stats: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
	return (
		<Stack.Navigator
			initialRouteName="Home"
			screenOptions={{
				headerStyle: {
					backgroundColor: theme.colors.primary,
				},
				headerTintColor: theme.colors.surface,
				headerTitleStyle: {
					fontWeight: '600',
					fontSize: 18,
				},
				headerShadowVisible: false,
				contentStyle: {
					backgroundColor: theme.colors.background,
				},
				animation: 'slide_from_right',
			}}
		>
			<Stack.Screen
				name="Home"
				component={HomeScreen}
				options={{ title: 'My Diary' }}
			/>
			<Stack.Screen
				name="NewEntry"
				component={NewEntryScreen}
				options={{ title: 'New Entry' }}
			/>
			<Stack.Screen
				name="EntryDetail"
				component={EntryDetailScreen}
				options={{ title: 'Entry Details' }}
			/>
			<Stack.Screen
				name="Stats"
				component={StatsScreen}
				options={{ title: 'Statistics' }}
			/>
		</Stack.Navigator>
	);
};

export default RootNavigator; 