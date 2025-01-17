import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { initDatabase } from './src/database/db';
import RootNavigator from './src/navigation/RootNavigator';
import { store } from './src/redux/store';
import { theme } from './src/styles/theme';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
        setIsReady(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to initialize database');
      }
    };

    init();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        {error && <Text style={{ marginTop: theme.spacing.md, color: theme.colors.error }}>{error}</Text>}
      </View>
    );
  }

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
}
