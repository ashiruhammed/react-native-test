# 🎬 Movie App

A beautiful React Native movie discovery app that allows users to browse, search, and save their favorite movies using The Movie Database (TMDB) API.

## 📱 Features

- **Browse Movies**: Discover popular, trending, and top-rated movies
- **Search**: Find movies by title with real-time search
- **Movie Details**: View comprehensive movie information including ratings, overview, cast, and more
- **Favorites**: Save and manage your favorite movies locally
- **Responsive Design**: Optimized for both iOS and Android devices
- **Offline Storage**: Favorites are stored locally using AsyncStorage

## 🛠 Tech Stack

- **React Native** (0.81.0) - Cross-platform mobile framework
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management
- **React Navigation** - Navigation and routing
- **React Native Paper** - Material Design components
- **Axios** - HTTP client for API calls
- **AsyncStorage** - Local data persistence
- **Vector Icons** - Beautiful icons throughout the app

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (>= 16.x)
- **npm** or **yarn**
- **React Native CLI**
- **Android Studio** (for Android development)
- **Xcode** (for iOS development - macOS only)
- **CocoaPods** (for iOS dependencies - macOS only)

> **Note**: Make sure you have completed the [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone github.com/ashiruhammed/react-native-test
cd react-native-test
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Install iOS Dependencies (macOS only)

```bash
cd ios && pod install && cd ..
```

## 🏃‍♂️ Running the App

### Start Metro Bundler

First, start the Metro bundler:

```bash
# Using npm
npm start

# Using yarn
yarn start
```

### Run on Android

```bash
# Using npm
npm run android

# Using yarn
yarn android
```

### Run on iOS (macOS only)

```bash
# Using npm
npm run ios

# Using yarn
yarn ios
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── MovieCard.tsx   # Movie card component
├── config/             # App configuration
│   └── index.ts        # API keys and app settings
├── navigation/         # Navigation setup
│   └── AppNavigator.tsx # Main navigation structure
├── screens/            # App screens
│   ├── HomeScreen.tsx      # Home/browse movies
│   ├── SearchScreen.tsx    # Search movies
│   ├── FavoritesScreen.tsx # Saved favorites
│   └── MovieDetailsScreen.tsx # Movie details
├── services/           # API services
│   └── movieApi.ts     # TMDB API integration
├── store/              # Redux store
│   ├── index.ts        # Store configuration
│   └── moviesSlice.ts  # Movies state management
├── types/              # TypeScript type definitions
│   └── movie.ts        # Movie-related types
└── utils/              # Utility functions
    └── storage.ts      # Local storage helpers
```

## 🧪 Testing

Run the test suite:

```bash
# Using npm
npm test

# Using yarn
yarn test
```

## 🔧 Available Scripts

| Script            | Description                    |
| ----------------- | ------------------------------ |
| `npm start`       | Start Metro bundler            |
| `npm run android` | Run on Android device/emulator |
| `npm run ios`     | Run on iOS device/simulator    |
| `npm test`        | Run test suite                 |
| `npm run lint`    | Run ESLint for code quality    |

## 🎨 Key Features Explained

### Home Screen

- Browse popular and trending movies
- Infinite scroll for seamless browsing
- Movie cards with poster, title, and rating

### Search Screen

- Real-time movie search
- Search by movie title
- Results displayed in grid format

### Movie Details

- Comprehensive movie information
- High-quality poster and backdrop images
- Movie overview, rating, release date
- Add/remove from favorites functionality

### Favorites Screen

- View all saved favorite movies
- Persistent local storage
- Easy management of favorite list

## 🔄 State Management

The app uses Redux Toolkit for state management:

- **Movies State**: Handles movie data, loading states, and favorites
- **Async Storage**: Persists favorites locally on device
- **Type Safety**: Full TypeScript integration for reliable state updates

## 🌐 API Integration

The app integrates with The Movie Database (TMDB) API:

- **Popular Movies**: Fetch trending and popular movies
- **Search**: Search movies by title
- **Movie Details**: Get detailed movie information
- **Images**: High-quality posters and backdrop images

## 🐛 Troubleshooting

### Common Issues

**Metro bundler not starting:**

```bash
npx react-native start --reset-cache
```

**Android build issues:**

```bash
cd android && ./gradlew clean && cd ..
npm run android
```

**iOS build issues:**

```bash
cd ios && pod install && cd ..
npm run ios
```

**API not working:**

- Check your internet connection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data
- [React Native Community](https://reactnative.dev/) for the amazing framework
- [Material Design](https://material.io/) for the design system

## 📞 Support

If you have any questions or run into issues, please:

1. Check the [troubleshooting section](#-troubleshooting)
2. Search existing [issues](https://github.com/your-username/MovieApp/issues)
3. Create a new issue if needed

---

Made with ❤️ using React Native
