interface OpenAISettings {
	apiKey?: string;
}

interface AISettings {
	openAI: OpenAISettings;
}

export const AISettings: AISettings = {
	openAI: {
		apiKey: process.env.OPENAI_API_KEY,
	},
};
