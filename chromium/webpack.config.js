import path from 'path';
import { fileURLToPath } from 'url';
import fg from 'fast-glob';
import copyWebpackPlugin from 'copy-webpack-plugin';
import WebpackBar from 'webpackbar';
import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin';

// Determine current environment
const NODE_ENV = process.env.NODE_ENV === "production" ? "production" : "development";

// Log a friendly message
console.log(`\n==============================`);
console.log(`  Building in ${NODE_ENV.toUpperCase()} mode`);
console.log(`==============================\n`);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Dynamically generate TS entries
const tsFiles = fg.sync('./src/**/*.ts');
const entries = tsFiles.reduce((acc, file) => {
    const entryKey = file.replace('./src/', '').replace(/\.ts$/, '');
    acc[entryKey] = file;
    return acc;
}, {})


const config = {
    mode: NODE_ENV === "production" ? "production" : "development",
    entry: entries,
    output: {
        filename: '[name].js',
        // Output goes to build/src or dev_build/src
        path: path.resolve(
            __dirname,
            NODE_ENV === "production" ? "build" : "dev_build",
            'src'
        ),
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new WebpackBar(),
        new FriendlyErrorsWebpackPlugin(),
        new copyWebpackPlugin({
            patterns: [
                // Copy the public folder
                {
                    from: path.resolve(__dirname, 'public'),
                    to: path.resolve(__dirname, NODE_ENV === "production" ? "build" : "dev_build", 'public')
                },
                // Copy manifest.json from project root
                {
                    from: 'manifest.json',
                    context: path.resolve(__dirname),
                    to: '../manifest.json'
                },
                {
                    // Use an absolute context for the HTML files
                    from: '**/*.html',
                    context: path.resolve(__dirname, 'src'),
                    to: '[path][name][ext]'
                },
                {
                    // Use an absolute context for the CSS files
                    from: '**/*.css',
                    context: path.resolve(__dirname, 'src'),
                    to: '[path][name][ext]'
                },
            ]
        })
    ],
    stats: 'none',
    devtool: NODE_ENV === "development" ? "source-map" : false
};


export default config;