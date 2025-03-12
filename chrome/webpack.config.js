import path from 'path';
import copyWebpackPlugin from 'copy-webpack-plugin';

export default {
    mode: process.env.NODE_ENV === "production" ? "production" : "development", // "production" | "development" 
    entry: {
        popup: "./src/popup/popup.ts",
        content: "./src/content/content.ts",
        settings: "./src/settings/settings.ts",
    },
    output: {
        filename: '[name].js', // output file will have the same name`
        path: path.resolve(__dirname, process.env.NODE_ENV === "production" ? "build" : "dev_build"),
    },
    resolve: {
        extension: ['.ts', '.js']
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
        new copyWebpackPlugin({
            patterns: [
                { from: 'src/manifest.json', to: 'manifest.json' },
                { from: 'src/popup/popup.html', to: 'popup.html' },
                { from: 'src/settings/settings.html', to: 'settings.html' },
            ]
        })
    ],
    watch: process.env.NODE_ENV === "development",
    devtool: process.env.NODE_ENV === "development" ? "source-map" : false
}