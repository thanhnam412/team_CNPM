<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:ui-rules -->
# 1. Local Rules Discovery & Core Architecture
Whenever you operate in this UI workspace, you MUST always look for and read `rule.md` files located in the directories you are working in. These local rule files contain critical constraints, naming conventions, and utility documentation specific to that folder.

**CRITICAL RULE FILES YOU MUST READ:**
- `app/rule.md`: Strictly defines the separation of Logic and UI. The `app` directory is ONLY for logic.
- `block-ui/rule.md`: Defines how to build Presentation Components, export Props, and usage rules.
- `components/ui/rule/rule.md`: Rules for customizing base UI components via wrappers.
- `lib/rule.md`: Documentation for utility functions like `formatCurrency`.
- `services/rule.md`: Quy trình và quy tắc tích hợp API (axios -> type -> tanstack -> logic -> ui).
- `flow/rule.md`: Bắt buộc lập tài liệu khảo sát luồng dữ liệu (Show/Up) vào file `flow-[page_name]-vX.md` trước khi tích hợp API.

# 2. Rule Registry Management
**CRITICAL:** Whenever you (the AI Agent) are instructed to create, define, or update a local `rule.md` file anywhere in this workspace, you MUST concurrently update this `AGENTS.md` file. You must add a reference to the newly created rule file into the "CRITICAL RULE FILES" list above, along with a brief description of what the rule dictates. This ensures future agents are aware of all newly established conventions.
<!-- END:ui-rules -->
