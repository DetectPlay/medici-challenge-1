import NextAuth from "next-auth";
import { OAuthConfig } from "next-auth/providers";
import GithubProvider from "next-auth/providers/github";

interface Profile {
	sub: string; // User ID
	name: string; // User's full name
	email: string; // User's email address
	// Add any additional fields specific to your user profile
}

const WorldCoinProvider: OAuthConfig<any> = {
	id: "worldcoin",
	name: "WorldCoin",
	type: "oauth",
	token: "https://id.worldcoin.org/token",
	wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
	authorization: "https://id.worldcoin.org/authorize",
	profile(profile) {
		return {
			id: profile.sub,
			name: profile.name,
			email: profile.email,
			image: profile.picture,
		};
	},
	clientId: process.env.WORLD_COIN_CLIENT_ID,
	clientSecret: process.env.WORLD_COIN_CLIENT_SECRET,
};
export const authOptions = {
	// Configure one or more authentication providers
	providers: [WorldCoinProvider],
	callbacks: {
		async jwt({ token, account }: any) {
			// Persist the OAuth access_token to the token right after signin
			if (account) {
				token.accessToken = account.access_token;
			}
			return token;
		},
		async session({ session, token, user }: any) {
			// Send properties to the client, like an access_token from a provider.
			session.accessToken = token.accessToken;
			return session;
		},
	},
	debug: true,
};
export default NextAuth(authOptions);
