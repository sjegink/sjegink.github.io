/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
	output: 'export',
	assetPrefix: isProd ? 'https://sjegink.github.io/exam' : undefined,
};

export default nextConfig;
