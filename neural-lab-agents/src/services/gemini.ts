import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AnalysisResult {
  score: number;
  security_issues: string[];
  static_analysis: string[];
  mentor_feedback: string;
  refactored_code: string;
}

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.INTEGER,
      description: "0-100, where 100 is flawless and secure",
    },
    security_issues: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of potential vulnerabilities like SQLi, hardcoded secrets, XSS. Be specific. If none, return ['None detected']",
    },
    static_analysis: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Structural/syntax improvements, performance tips",
    },
    mentor_feedback: {
      type: Type.STRING,
      description: "Encouraging, gamified feedback acting like a supportive senior dev mentor.",
    },
    refactored_code: {
      type: Type.STRING,
      description: "The fully refactored, secure, and improved code snippet",
    },
  },
  required: ["score", "security_issues", "static_analysis", "mentor_feedback", "refactored_code"],
};

export async function analyzeCode(code: string): Promise<AnalysisResult> {
  const prompt = `You are an advanced Multi-Agent Code Review System consisting of:
  1. A Static Auditor 
  2. A Security Sentinel
  3. A Senior Mentor
  
  Analyze the following code. Use long-chain reasoning to find vulnerabilities, bad practices, and structural issues.
  
  Code to analyze:
  ${code}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      }
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    let text = response.text;
    if (text.startsWith("```")) {
      text = text.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

