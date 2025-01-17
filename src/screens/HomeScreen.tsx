import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, FAB, List, Searchbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEntries } from '../redux/entriesSlice';
import { RootState } from '../redux/store';

const HomeScreen = () => {
	const navigation = useNavigation();
	const dispatch = useDispatch();
	const [searchQuery, setSearchQuery] = React.useState('');

	const { list: entries, loading, error } = useSelector((state: RootState) => state.entries);

	useEffect(() => {
		dispatch(fetchEntries());
	}, [dispatch]);

	const filteredEntries = entries.filter(entry =>
		entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
		entry.category.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (loading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.centered}>
				<Text>Error: {error}</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Searchbar
				placeholder="Search entries..."
				onChangeText={setSearchQuery}
				value={searchQuery}
				style={styles.searchBar}
			/>

			<List.Section>
				{filteredEntries.map(entry => (
					<List.Item
						key={entry.id}
						title={new Date(entry.date).toLocaleDateString()}
						description={entry.content.substring(0, 50) + '...'}
						left={props => <List.Icon {...props} icon="notebook" />}
						onPress={() => navigation.navigate('EntryDetail', { entryId: entry.id })}
					/>
				))}
			</List.Section>

			<FAB
				style={styles.fab}
				icon="plus"
				onPress={() => navigation.navigate('NewEntry')}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	searchBar: {
		margin: 16,
	},
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
	},
});

export default HomeScreen; 