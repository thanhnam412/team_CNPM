import { Injectable, Inject } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ConfigService } from "@nestjs/config";
import {
  insertProjectCopilotQuery,
  insertProjectMemberCopilotQuery,
  insertMilestoneCopilotQuery,
  insertTaskCopilotQuery,
  getProjectCopilotQuery,
  searchExpertsCopilotQuery,
  insertQuickTaskCopilotQuery,
} from "@/queries/copilot";

@Injectable()
export class CopilotService {
  private genAI: GoogleGenerativeAI | undefined;
  private model: any;

  constructor(
    @Inject(KYSELY_DB) private db: Kysely<DB>,
    private configService: ConfigService,
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
      return this.executeCreateProject(userId, parsed.data, parsed.message);
    } else if (parsed.intent === "SEARCH_EXPERTS") {
      return this.executeSearchExperts(parsed.data, parsed.message);
    } else if (parsed.intent === "CREATE_QUICK_TASK") {
      return this.executeCreateQuickTask(userId, parsed.data, parsed.message);
    }

    return parsed;
  }

  private async executeCreateProject(
    userId: string,
    data: any,
    message: string,
  ) {
    // 1. Create project
    const projectId = crypto.randomUUID();
    await insertProjectCopilotQuery(this.db, {
      id: projectId,
      title: data.title || "Untitled Project",
      description: data.description || "",
      budget: data.budget?.toString() || "0",
      status: "OPEN",
      spent: "0",
      escrow: "0",
      updatedAt: new Date(),
    });

    // 2. Create project member (Client Admin)
    await insertProjectMemberCopilotQuery(this.db, {
      id: crypto.randomUUID(),
      projectId,
      userId,
      role: "CLIENT_ADMIN",
      status: "ACTIVE",
      updatedAt: new Date(),
    });

    // 3. Create milestones & tasks
    const milestones = data.milestones || [];
    for (const milestoneData of milestones) {
      const milestoneId = crypto.randomUUID();
      await insertMilestoneCopilotQuery(this.db, {
        id: milestoneId,
        projectId,
        title: milestoneData.title || "Milestone",
        budget: milestoneData.budget?.toString() || "0",
        status: "PENDING",
        updatedAt: new Date(),
      });

      const tasks = milestoneData.tasks || [];
      for (const taskTitle of tasks) {
        await insertTaskCopilotQuery(this.db, {
          id: crypto.randomUUID(),
          projectId,
          milestoneId,
          title: taskTitle,
          status: "TODO",
          priority: "MEDIUM",
          updatedAt: new Date(),
        });
      }
    }

    // Fetch the fully created project to return
    const project = await getProjectCopilotQuery(this.db, projectId);

    return {
      intent: "CREATE_PROJECT",
      project,
      message,
    };
  }

  private async executeSearchExperts(data: any, message: string) {
    const keywords = data.keywords || [];
    const skills = data.skills || [];
    const searchTerms = [...keywords, ...skills];

    const experts = await searchExpertsCopilotQuery(this.db, searchTerms);

    return {
      intent: "SEARCH_EXPERTS",
      experts: experts.map((e) => ({
        id: e.id,
        name: e.name,
        avatar: e.avatar,
        email: e.email,
        title: e.title,
        bio: e.bio,
        skills: e.skills,
        rate: e.hourlyRate,
      })),
      message,
    };
  }

  private async executeCreateQuickTask(
    userId: string,
    data: any,
    message: string,
  ) {
    const taskId = crypto.randomUUID();

    await insertQuickTaskCopilotQuery(this.db, {
      id: taskId,
      clientId: userId,
      title: data.title || "Untitled Task",
      description: data.description || "",
      budget: data.budget?.toString() || "0",
      status: "OPEN",
      proposalsCount: 0,
      updatedAt: new Date(),
    });

    return {
      intent: "CREATE_QUICK_TASK",
      task: {
        id: taskId,
        title: data.title,
        budget: data.budget,
      },
      message: message,
    };
  }
}
