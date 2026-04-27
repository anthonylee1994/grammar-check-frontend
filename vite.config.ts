import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    build: {
        rolldownOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        {
                            name: "react-vendor",
                            test: /node_modules\/(?:react|react-dom|react-router-dom)\//,
                            priority: 30,
                        },
                        {
                            name: "mui-vendor",
                            test: /node_modules\/@mui\//,
                            priority: 20,
                        },
                        {
                            name: "app-vendor",
                            test: /node_modules\//,
                            priority: 10,
                        },
                    ],
                },
            },
        },
    },
    plugins: [react()],
});
