import path from 'path';
import { fileURLToPath } from 'url';
import fg from 'fast-glob';
import copywebpackplugin from 'copy-webpack-plugin';
import webpackbar from 'webpackbar';
import friendlyerrorswebpackplugin from '@soda/friendly-errors-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamically generate TS entries
const tsFiles = fg.sync('./src/**/*.ts');
const entries = tsFiles.reduce((acc, file) => {
    const entryKey = file.replace('./src/', '').replace(/\.ts$/, '');
    acc[entryKey] = file;
    return acc;
}, {})

export default {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    entry: entries,
    output: {
        filename: '[name].js',
        // Output goes to build/src or dev_build/src
        path: path.resolve(
            __dirname,
            process.env.NODE_ENV === "production" ? "build" : "dev_build",
            'src'
        )
    },
    resolve: {
        extensions: ['.ts', '.js']
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
        new webpackbar(),
        new friendlyerrorswebpackplugin(),
        new copywebpackplugin({
            patterns: [
                // Copy the public folder
                {
                    from: path.resolve(__dirname, 'public'),
                    to: path.resolve(__dirname, process.env.NODE_ENV === "production" ? "build" : "dev_build", 'public')
                },
                // Manifest.json from project root
                {
                    from: 'manifest.json',
                    context: path.resolve(__dirname),
                    to: '../manifest.json',
                },
                // html files
                {
                    from: '**/*.html',
                    context: path.resolve(__dirname, 'src'),
                    to: '[path][name][ext]',
                },
                // CSs files
                {
                    from: '**/*.css',
                    context: path.resolve(__dirname, 'src'),
                    to: '[path][name][ext]',
                }
            ]
        })
    ],
    stats: 'none',
    devtool: process.env.NODE_ENV === "development" ? "source-map" : false
}