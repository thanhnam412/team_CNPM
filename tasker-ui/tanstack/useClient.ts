import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export interface FinanceData {
  availableBalance: string;
  inEscrow: string;
  spentMTD: string;
}

export interface PendingAction {
  id: string;
  projectId?: string;
  task: string;
  expert: string;
  type: string;
}

export interface ActiveProject {
  id: string;
  name: string;
  deadlineInfo: string;
  status: string;
  progress: number;
  escrow: string;
}

export interface UnreadMessage {
  id: string;
  name: string;
  time: string;
  msg: string;
  unread: number;
  context: string;
}

export interface ClientOverviewResponse {
  finance: FinanceData;
  pendingActions: PendingAction[];
  activeProjects: ActiveProject[];
  unreadMessages: UnreadMessage[];
}

export const useClientOverview = () => {
  return useQuery({
    queryKey: ["clientOverview"],
    queryFn: async (): Promise<ClientOverviewResponse> => {
      const response = await api.get("/clients/me/overview");
      return response.data;
    },
  });
};
