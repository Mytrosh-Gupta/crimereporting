const { GoogleGenAI } = require('@google/genai');

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const analyzeComplaint = async (complaintData) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY is not set. Using fallback values.');
            return getFallbackValues();
        }

        const prompt = `Analyze the following crime/complaint report and provide a JSON response summarizing it, categorizing it, and assigning a priority.

Complaint Details:
Title: ${complaintData.title}
Location: ${complaintData.location}
Description: ${complaintData.description}

You must return a JSON object with EXACTLY these three keys:
- "category": Must be one of exactly ["Theft", "Cyber Fraud", "Harassment", "Missing Person", "Assault", "Other"]. Choose the main one that fits best.
- "summary": A very brief, one-sentence summary of the incident (max 100 characters).
- "priority": Must be one of exactly ["High", "Medium", "Low"]. Use 'High' for immediate danger/assault/missing person, 'Medium' for theft/fraud, 'Low' for minor issues.

Do not include markdown blocks or any other text, just JSON.`;

        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const text = response.text;
        const parsed = JSON.parse(text);

        // Validation
        const validCategories = ['Theft', 'Cyber Fraud', 'Harassment', 'Missing Person', 'Assault', 'Other'];
        const validPriorities = ['High', 'Medium', 'Low'];

        let category = parsed.category;
        if (!validCategories.includes(category)) {
            category = 'Other';
        }

        let priority = parsed.priority;
        if (!validPriorities.includes(priority)) {
            priority = 'Medium';
        }

        return {
            category,
            priority,
            summary: parsed.summary || 'No summary available.'
        };

    } catch (error) {
        console.error('Error analyzing complaint via AI:', error);
        return getFallbackValues();
    }
};

const getFallbackValues = () => {
    return {
        category: 'Other',
        priority: 'Medium',
        summary: 'Automatic analysis unavailable.',
    };
};

module.exports = {
    analyzeComplaint
};
