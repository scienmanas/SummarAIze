import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
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
function getAllTsFiles(dir, extensions) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory())
            results = results.concat(getAllTsFiles(filePath, extensions));
        else if (extensions.some((ext) => file.endsWith(ext)))
            results.push(filePath);
    })
    return results
}

function getEntries() {
    const srcDir = path.resolve(__dirname, 'src');
    const files = getAllTsFiles(srcDir, ['.ts', '.js']);
    const entries = files.reduce((acc, file) => {
        // Create a key relative relative to the src folder and remove the extension
        const relativePath = path.relative(srcDir, file);
        const entryKey = relativePath.replace(/\.ts$/, '');
        acc[entryKey] = file;
        return acc;
    }, {})
    return entries
}

const config = {
    mode: NODE_ENV === "production" ? "production" : "development",
    entry: () => getEntries(),
    output: {
        filename: '[name].js',
        // Output goes to build/src or dev_build/src
        path: path.resolve(
            __dirname,
            NODE_ENV === "production" ? "build" : "dev_build",
            'src'
        ),
        clean: true,
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname),
        }
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