"use client";

import { ActiveUserPermissionAlert } from "@/components/active-user-permission-alert";
import { AiAutoQualityReport } from "@/components/ai-auto-quality-report";
import { ApproveMilestoneClient } from "@/components/approve-milestone-client";
import { DeliveryPolicyConfig } from "@/components/delivery-policy-config";
import { SecurityReviewAlert } from "@/components/security-review-alert";
import { SystemConfigWarning } from "@/components/system-config-warning";

export default function ReviewModerationPage() {
  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-10">
      <AiAutoQualityReport></AiAutoQualityReport>
      <ApproveMilestoneClient></ApproveMilestoneClient>
      <SecurityReviewAlert></SecurityReviewAlert>
      <DeliveryPolicyConfig></DeliveryPolicyConfig>
      <SystemConfigWarning></SystemConfigWarning>
      <ActiveUserPermissionAlert></ActiveUserPermissionAlert>
    </main>
  );
}
