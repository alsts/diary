import { MD3LightTheme } from 'react-native-paper';

export const theme = {
	...MD3LightTheme,
	colors: {
		...MD3LightTheme.colors,
		primary: '#000000',
		secondary: '#404040',
		background: '#f5f7fa',
		surface: '#ffffff',
		error: '#b00020',
		text: '#1a1c1e',
		disabled: '#9e9e9e',
		placeholder: '#757575',
		backdrop: 'rgba(0, 0, 0, 0.5)',
	},
	roundness: 12,
	spacing: {
		xs: 4,
		sm: 8,
		md: 16,
		lg: 24,
		xl: 32,
	},
	elevation: {
		small: 2,
		medium: 4,
		large: 8,
	},
}; 