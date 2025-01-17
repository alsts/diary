import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, FAB, Searchbar, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEntries } from '../redux/entriesSlice';
import { RootState } from '../redux/store';
import { theme } from '../styles/theme';

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
				<ActivityIndicator size="large" color={theme.colors.primary} />
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.centered}>
				<Text variant="bodyLarge" style={{ color: theme.colors.error }}>{error}</Text>
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
				iconColor={theme.colors.primary}
				elevation={theme.elevation.small}
			/>

			{filteredEntries.length === 0 ? (
				<View style={styles.emptyState}>
					<Text variant="titleMedium" style={styles.emptyStateText}>
						No entries found
					</Text>
				</View>
			) : (
				<View style={styles.entriesList}>
					{filteredEntries.map(entry => (
						<Card
							key={entry.id}
							style={styles.card}
							onPress={() => navigation.navigate('EntryDetail', { entryId: entry.id })}
						>
							<Card.Content>
								<Text variant="titleMedium" style={styles.date}>
									{new Date(entry.date).toLocaleDateString()}
								</Text>
								<Text variant="bodyMedium" style={styles.preview}>
									{entry.content.substring(0, 100)}
									{entry.content.length > 100 ? '...' : ''}
								</Text>
								<Text variant="labelSmall" style={styles.category}>
									{entry.category}
								</Text>
							</Card.Content>
						</Card>
					))}
				</View>
			)}

			<FAB
				icon="plus"
				style={styles.fab}
				onPress={() => navigation.navigate('NewEntry')}
				color={theme.colors.surface}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	searchBar: {
		margin: theme.spacing.md,
		borderRadius: theme.roundness,
		backgroundColor: theme.colors.surface,
	},
	entriesList: {
		padding: theme.spacing.md,
	},
	card: {
		marginBottom: theme.spacing.md,
		backgroundColor: theme.colors.surface,
		borderRadius: theme.roundness,
		elevation: theme.elevation.small,
	},
	date: {
		color: theme.colors.primary,
		marginBottom: theme.spacing.xs,
	},
	preview: {
		color: theme.colors.text,
		marginBottom: theme.spacing.sm,
	},
	category: {
		color: theme.colors.secondary,
		textTransform: 'uppercase',
	},
	emptyState: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: theme.spacing.xl,
	},
	emptyStateText: {
		color: theme.colors.placeholder,
		textAlign: 'center',
	},
	fab: {
		position: 'absolute',
		margin: theme.spacing.md,
		right: 0,
		bottom: 0,
		backgroundColor: theme.colors.primary,
	},
});

export default HomeScreen; 