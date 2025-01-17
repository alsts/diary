import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { initDatabase } from './src/database/db';
import RootNavigator from './src/navigation/RootNavigator';
import { store } from './src/redux/store';

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        {error && <Text style={{ marginTop: 16, color: 'red' }}>{error}</Text>}
      </View>
    );
  }

  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
}
