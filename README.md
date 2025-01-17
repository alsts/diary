# Diary App

A cross-platform mobile application for keeping a personal diary, built with React Native and Expo.

## Features

- Create, edit, and delete diary entries
- Attach images to entries
- Categorize entries
- Search through entries
- View entry statistics
- Offline storage using SQLite
- Modern Material Design UI

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd diary-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Follow the Expo CLI instructions to run the app on your desired platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan the QR code with Expo Go app on your physical device

## Project Structure

```
src/
├── components/          # Reusable components
├── screens/            # Screen components
├── navigation/         # Navigation setup
├── redux/             # Redux store and slices
├── database/          # SQLite database operations
├── assets/           # Static assets
├── utils/            # Utility functions
└── styles/           # Global styles
```

## Technologies Used

- React Native
- Expo
- TypeScript
- Redux Toolkit
- React Navigation
- React Native Paper
- SQLite
- Styled Components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 