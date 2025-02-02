const path = require('path');

module.exports = {
  // Entry point for your React app
  entry: './src/react-ui/index.tsx',  // Adjusted to point to the correct entry file

  output: {
    filename: 'content.bundle.js',  // Output the bundled file
    path: path.resolve(__dirname, 'dist'),  // The dist directory will contain the bundle
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'], // Add both .ts and .tsx
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,  // Process both TypeScript (.ts) and TypeScript JSX (.tsx) files
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,  // If you use CSS
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,  // Process images (if needed)
        use: ['file-loader'],
      },
    ],
  },

  // Enable source maps for debugging
  devtool: 'source-map',

  // Set mode to development or production as needed
  mode: 'development', // Or 'production'
};
