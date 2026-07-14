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

  async processChat(userId: string, message: string) {
    const systemPrompt = `You are an AI assistant for a Client on a freelance platform called Tasker.
Your goal is to parse the user's natural language request into a strictly structured JSON response.

There are two primary intents:
1. CREATE_PROJECT: If the user wants to create a new project.
2. SEARCH_EXPERTS: If the user wants to search for experts.
3. CREATE_QUICK_TASK: If the user wants to create a single standalone task without a full project.
4. UNKNOWN: If the user's request is not related to creating a project, task, or searching for experts.

If INTENT is CREATE_PROJECT, respond with exactly this JSON format (no markdown code blocks, just raw JSON):
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

If INTENT is SEARCH_EXPERTS, respond with exactly this JSON format:
{
  "intent": "SEARCH_EXPERTS",
  "data": {
    "skills": ["react", "node", "design"],
    "keywords": ["fullstack", "developer"]
  },
  "message": "A friendly response message saying you found some experts."
}

If INTENT is CREATE_QUICK_TASK, respond with exactly this JSON format:
{
  "intent": "CREATE_QUICK_TASK",
  "data": {
    "title": "A concise task title",
    "description": "Task description",
    "budget": "estimated budget as a string number (e.g., 500)"
  },
  "message": "A friendly response message confirming task creation."
}

If INTENT is UNKNOWN, respond with exactly this JSON format:
{
  "intent": "UNKNOWN",
  "message": "A helpful reply acting as a chat assistant."
}

User request: "${message}"`;

    const model = this.getModel();
    const result = await model.generateContent(systemPrompt);
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
