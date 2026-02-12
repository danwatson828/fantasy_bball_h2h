
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTeamInsights = async (teamData: any, matchupData: any) => {
  try {
    const protectedPlayers = teamData.roster.filter((p: any) => p.isProtected).map((p: any) => p.name);
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze this H2H fantasy basketball situation: Team: ${JSON.stringify(teamData)} Matchup: ${JSON.stringify(matchupData)}`,
      config: { thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text;
  } catch (error) {
    return "Unable to fetch AI insights.";
  }
};

export const getAutoTradeSuggestions = async (roster: any[], pool: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
        Identify the 3 best trades between my Roster and the Available Pool.
        My Roster: ${JSON.stringify(roster.map(p => ({ name: p.name, stats: p.avgStats, isProtected: p.isProtected })))}
        Pool: ${JSON.stringify(pool.map(p => ({ name: p.name, stats: p.avgStats })))}
        
        Focus on H2H synergy. If I'm strong in Assists, find trades that lock that in or fix a punt.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              targetPlayerName: { type: Type.STRING },
              assetToGiveName: { type: Type.STRING },
              synergyScore: { type: Type.NUMBER },
              categoryImpacts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    delta: { type: Type.NUMBER },
                    isImprovement: { type: Type.BOOLEAN }
                  }
                }
              },
              thePitch: { type: Type.STRING, description: "A persuasive argument for the OTHER manager explaining why they should accept." },
              negotiationDifficulty: { type: Type.STRING, enum: ['Easy', 'Fair', 'Hard'] }
            },
            required: ["targetPlayerName", "assetToGiveName", "synergyScore", "categoryImpacts", "thePitch", "negotiationDifficulty"]
          }
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Scout Error:", error);
    return [];
  }
};

export const getTeamScoutReport = async (myRoster: any[], targetTeam: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
        Analyze this fantasy basketball opponent for a Head-to-Head league.
        My Team Roster: ${JSON.stringify(myRoster.map(p => ({ name: p.name, stats: p.avgStats })))}
        Opponent Team: ${JSON.stringify(targetTeam)}

        Task:
        1. List the opponent's 3 greatest category strengths.
        2. Identify 2 categories where they are vulnerable (potential punts).
        3. Matchup Analysis: How does my team stack up against them? Which categories will decide the week?
        4. Strategy: One specific tip to beat this owner (e.g. "Stream blocks on Sunday to flip that category").

        Keep the tone professional and tactical.
      `,
      config: { thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text;
  } catch (error) {
    console.error("Scout Report Error:", error);
    return "Failed to generate scouting report.";
  }
};

export const getMatchupStrategy = async (matchupData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze matchup: ${JSON.stringify(matchupData)}`,
      config: { thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text;
  } catch (error) {
    return "Failed to generate strategy.";
  }
};

export const getPlayerDeepDive = async (playerName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Stats and news for ${playerName}`,
      config: { tools: [{ googleSearch: {} }] },
    });
    return { text: response.text, sources: [] };
  } catch (error) {
    throw error;
  }
};
