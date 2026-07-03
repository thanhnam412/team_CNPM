import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Building,
  Globe,
  LineChart,
  RefreshCw,
} from "lucide-react";

const impactedProjects = [
  {
    name: "Project Alpha - Q4 Delivery",
    icon: <Building className="w-4 h-4 text-muted-foreground" />,
    tier: "Tier 1",
    tierVariant: "secondary" as const,
  },
  {
    name: "Global Expansion Initative",
    icon: <Globe className="w-4 h-4 text-muted-foreground" />,
    tier: "Tier 1",
    tierVariant: "secondary" as const,
  },
  {
    name: "Data Analytics Engine V2",
    icon: <LineChart className="w-4 h-4 text-muted-foreground" />,
    tier: "Tier 2",
    tierVariant: "outline" as const,
  },
];

export function SystemConfigWarning() {
  return (
    <Card className="w-full max-w-lg shadow-lg border-destructive/50 overflow-hidden">
      {/* Header */}
      <CardHeader className="bg-destructive/10 p-4 sm:p-6 flex flex-row items-center gap-3 border-b border-destructive/20">
        <AlertTriangle className="w-6 h-6 text-destructive" />
        <h2 className="text-lg font-semibold text-destructive-foreground m-0">
          Cảnh báo thay đổi cấu hình
        </h2>
      </CardHeader>

      {/* Body */}
      <CardContent className="p-6 space-y-6">
        <p className="text-sm text-foreground leading-relaxed">
          Các thay đổi về Commission Fee sẽ ảnh hưởng đến{" "}
          <strong className="text-destructive font-semibold">
            24 dự án đang hoạt động
          </strong>
          . Bạn có chắc chắn muốn áp dụng thay đổi này ngay lập tức không?
        </p>

        {/* Impact Details */}
        <div className="bg-muted/40 rounded-lg border p-4">
          <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Impacted High-Value Projects
          </h4>
          <ul className="space-y-3">
            {impactedProjects.map((project, index) => (
              <li
                key={index}
                className={`flex items-center justify-between ${
                  index > 0 ? "border-t border-border/50 pt-3" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {project.icon}
                  <span className="text-sm font-medium text-foreground">
                    {project.name}
                  </span>
                </div>
                <Badge variant={project.tierVariant}>{project.tier}</Badge>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-right">
            <a
              href="#"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all 24 projects
            </a>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="bg-muted/30 p-4 flex justify-end gap-3 border-t">
        <Button variant="outline">Hủy bỏ</Button>
        <Button variant="destructive" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Xác nhận & Cập nhật
        </Button>
      </CardFooter>
    </Card>
  );
}
