# Hotel Booking System

This is a hotel booking system with a comprehensive price comparison feature.

## Features

### Price Comparison

The price comparison feature allows users to:

- Search for hotels by location with auto-suggestions
- View popular destinations with hotel statistics (count, average price, price range)
- Compare hotel prices across different locations
- Filter results by price range and amenities
- Sort hotels by price or rating
- See which hotels offer prices below the location average

### Hotel Booking

- Browse hotels by location
- View detailed hotel information
- Book rooms with date selection
- Manage bookings

### Admin Features

- Add and manage hotels
- Edit hotel information
- View booking statistics

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies

```bash
cd Frontend
npm install
```

### Running the Application

```bash
npm run dev
```

## How to Use the Price Comparison Feature

1. Navigate to the home page
2. Scroll down to the "Find the Best Hotel Prices" section
3. Enter a location in the search bar
4. Browse the list of hotels and use filters to refine your search
5. Click "View Deal" on any hotel to see more details and book

## Technical Implementation

The price comparison feature uses React Query to fetch hotel data and analyze pricing trends. It implements:

- Flexible search with partial matching and fuzzy string comparison
- Price analysis algorithms to identify deals below market average
- Responsive UI that works well on all devices

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
