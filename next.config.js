/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
		],
	},
	async rewrites() {
		return [
			{ source: '/uploads/:filename', destination: '/api/uploads/:filename' },
		];
	},
};

module.exports = nextConfig;
