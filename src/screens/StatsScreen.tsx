import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const StatsScreen = () => {
	const entries = useSelector((state: RootState) => state.entries.list);

	const getCategoryStats = () => {
		const stats: Record<string, number> = {};
		entries.forEach(entry => {
			stats[entry.category] = (stats[entry.category] || 0) + 1;
		});
		return stats;
	};

	const getMonthlyStats = () => {
		const stats: Record<string, number> = {};
		entries.forEach(entry => {
			const month = new Date(entry.date).toLocaleString('default', { month: 'long', year: 'numeric' });
			stats[month] = (stats[month] || 0) + 1;
		});
		return stats;
	};

	const categoryStats = getCategoryStats();
	const monthlyStats = getMonthlyStats();

	return (
		<ScrollView style={styles.container}>
			<Card style={styles.card}>
				<Card.Title title="Entries by Category" />
				<Card.Content>
					{Object.entries(categoryStats).map(([category, count]) => (
						<View key={category} style={styles.statRow}>
							<Text style={styles.statLabel}>{category}</Text>
							<Text style={styles.statValue}>{count} entries</Text>
						</View>
					))}
				</Card.Content>
			</Card>

			<Card style={styles.card}>
				<Card.Title title="Entries by Month" />
				<Card.Content>
					{Object.entries(monthlyStats).map(([month, count]) => (
						<View key={month} style={styles.statRow}>
							<Text style={styles.statLabel}>{month}</Text>
							<Text style={styles.statValue}>{count} entries</Text>
						</View>
					))}
				</Card.Content>
			</Card>

			<Card style={styles.card}>
				<Card.Title title="Overall Statistics" />
				<Card.Content>
					<View style={styles.statRow}>
						<Text style={styles.statLabel}>Total Entries</Text>
						<Text style={styles.statValue}>{entries.length}</Text>
					</View>
					<View style={styles.statRow}>
						<Text style={styles.statLabel}>Categories Used</Text>
						<Text style={styles.statValue}>{Object.keys(categoryStats).length}</Text>
					</View>
					<View style={styles.statRow}>
						<Text style={styles.statLabel}>Months Active</Text>
						<Text style={styles.statValue}>{Object.keys(monthlyStats).length}</Text>
					</View>
				</Card.Content>
			</Card>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		padding: 16,
	},
	card: {
		marginBottom: 16,
	},
	statRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	statLabel: {
		fontSize: 16,
		color: '#333',
	},
	statValue: {
		fontSize: 16,
		color: '#666',
		fontWeight: 'bold',
	},
});

export default StatsScreen; 