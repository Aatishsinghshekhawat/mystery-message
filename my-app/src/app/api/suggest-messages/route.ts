import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

        const google = createGoogleGenerativeAI({
            apiKey: process.env.Gemini_API_KEY
        });

        const { text } = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt,
        });

        return new Response(text);
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json({
            success: false,
            message: "Error generating suggestions"
        }, { status: 500 });
    }
}
