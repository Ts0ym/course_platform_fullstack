/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: process.env.API_IMAGES_DOMAIN,
                // Вы можете добавить порт, если это необходимо, например:
                port: process.env.API_IMAGES_PORT,
                // Можно использовать pathname для дополнительного уточнения путей:
                // pathname: '/images/**'
            }
        ]
    },
    reactStrictMode: false,
    experimental: {
        optimizePackageImports: [
            'react-bootstrap',
            'dompurify',
            'draft-js',
            'draft-js-export-html',
            '@fortawesome/fontawesome-svg-core',
            'react-toastify'
        ]
    }
};

export default nextConfig;
