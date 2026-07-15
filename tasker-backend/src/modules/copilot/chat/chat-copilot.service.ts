import { Injectable } from "@nestjs/common";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ConfigService } from "@nestjs/config";
import { CreateProjectCopilotService } from "../create-project/create-project-copilot.service";
import { SearchExpertsCopilotService } from "../search-experts/search-experts-copilot.service";
import { CreateQuickTaskCopilotService } from "../create-quick-task/create-quick-task-copilot.service";

@Injectable()
export class ChatCopilotService {
  private genAI: GoogleGenerativeAI | undefined;
  private model: any;

  constructor(
    private configService: ConfigService,
    private createProjectCopilotService: CreateProjectCopilotService,
    private searchExpertsCopilotService: SearchExpertsCopilotService,
    private createQuickTaskCopilotService: CreateQuickTaskCopilotService,
  ) {}

  private getModel() {
    if (!this.model) {
      const apiKey =
        this.configService.get<string>("GEMINI_API_KEY") || "MISSING_API_KEY";
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    }
    return this.model;
  }

  async processChat(userId: string, message: string, history: any[] = []) {
    const systemPrompt = `You are an AI assistant for a Client on a freelance platform called Tasker.
Your goal is to converse with the user, understand their needs, and eventually parse their natural language request into a strictly structured JSON response when you have ENOUGH information.

There are 5 possible intents:
1. ASK_CLARIFICATION: Use this if the user wants to CREATE_PROJECT or CREATE_QUICK_TASK but is MISSING required details (like Title, Description, Budget).
2. CREATE_PROJECT: Use this ONLY if the user wants to create a new project AND you have already gathered a Title, Description, and Budget from the chat history.
3. SEARCH_EXPERTS: If the user wants to search for experts based on skills/keywords.
4. CREATE_QUICK_TASK: Use this ONLY if the user wants to create a single standalone task AND you have already gathered a Title, Description, and Budget.
5. UNKNOWN: If the user's request is not related to the above or you are just answering a general question.

If INTENT is ASK_CLARIFICATION, respond with exactly this JSON:
{
  "intent": "ASK_CLARIFICATION",
  "message": "A friendly response asking the user for the missing details (e.g., budget, description)."
}

If INTENT is CREATE_PROJECT, respond with exactly this JSON:
{
  "intent": "CREATE_PROJECT",
  "data": {
    "title": "A concise project title",
    "description": "Project description",
    "budget": "estimated budget as a string number (e.g., 5000)",
    "milestones": [
      {
        "title": "Milestone title",
        "budget": "Milestone budget",
        "tasks": ["Task 1", "Task 2"]
      }
    ]
  },
  "message": "A friendly response message confirming project creation."
}

If INTENT is SEARCH_EXPERTS, respond with exactly this JSON:
{
  "intent": "SEARCH_EXPERTS",
  "data": {
    "skills": ["react", "node", "design"],
    "keywords": ["fullstack", "developer"]
  },
  "message": "A friendly response message saying you found some experts."
}

If INTENT is CREATE_QUICK_TASK, respond with exactly this JSON:
{
  "intent": "CREATE_QUICK_TASK",
  "data": {
    "title": "A concise task title",
    "description": "Task description",
    "budget": "estimated budget as a string number (e.g., 500)"
  },
  "message": "A friendly response message confirming task creation."
}

If INTENT is UNKNOWN, respond with exactly this JSON:
{
  "intent": "UNKNOWN",
  "message": "A helpful reply acting as a chat assistant."
}

DO NOT INVENT FAKE BUDGETS OR TITLES. IF THE USER DID NOT PROVIDE THEM IN THE CHAT HISTORY, YOU MUST RETURN 'ASK_CLARIFICATION'.
Respond ONLY with raw JSON, no markdown blocks.`;

    const model = this.getModel();
    
    const formattedHistory = history.map(h => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }]
    }));
    
    const chatSession = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood. I will strictly follow the JSON output format and ask for clarification if information is missing." }] },
        ...formattedHistory
      ],
      generationConfig: {
        maxOutputTokens: 4096,
      }
    });

    const result = await chatSession.sendMessage(message);
    const text = result.response.text();

    let parsed: any;
    try {
      // Clean up potential markdown code blocks (e.g. \`\`\`json ... \`\`\`)
      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      return {
        intent: "UNKNOWN",
        message: text,
      };
    }

    if (parsed.intent === "CREATE_PROJECT") {
      return this.createProjectCopilotService.execute(
        userId,
        parsed.data,
        parsed.message,
      );
    } else if (parsed.intent === "SEARCH_EXPERTS") {
      return this.searchExpertsCopilotService.execute(
        parsed.data,
        parsed.message,
      );
    } else if (parsed.intent === "CREATE_QUICK_TASK") {
      return this.createQuickTaskCopilotService.execute(
        userId,
        parsed.data,
        parsed.message,
      );
    }

    return parsed;
  }
}
