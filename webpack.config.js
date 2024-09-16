const path = require('path')

module.exports = {
  entry: './src/index.ts', // Entry point of your application
  output: {
    filename: 'bundle.js', // Output file name
    path: path.resolve(__dirname, 'docs'), // Output directory
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Apply this rule to TypeScript files
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'], // Resolve these file extensions
  },
  devtool: 'inline-source-map', // Useful for debugging
  devServer: {
    static: path.join(__dirname, 'docs'), // Serve static files from the 'dist' directory
    hot: true, // Enable hot module replacement
    open: true, // Open the browser after server had been started
    port: 9000, // Port to listen on
  },
  mode: 'development', // Set to 'production' for production builds
}
