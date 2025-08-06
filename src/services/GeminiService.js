export class GeminiService {
    constructor() {
        this.apiKey = ""; // Handled by environment
        this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${this.apiKey}`;
    }

    async getSavingTips(results) {
        const { monthly, yearly } = results;
        const prompt = `My average electricity consumption is ${monthly.toFixed(2)} kWh per month (${yearly.toFixed(2)} kWh per year). Based on this usage, provide a few actionable and personalized energy-saving tips. Make them easy to understand. Format the response as a simple list.`;

        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };

        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
            return this.formatResponse(result.candidates[0].content.parts[0].text);
        } else {
            throw new Error('Unexpected API response structure.');
        }
    }

    formatResponse(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-purple-800">$1</strong>')
            .replace(/^\* (.*?)$/gm, '<li class="flex items-start mb-3"><span class="text-green-500 mr-3 mt-1">✓</span><span>$1</span></li>');
    }
}