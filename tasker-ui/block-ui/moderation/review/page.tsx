"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  EyeOff,
  Filter,
  Flag,
  MoreVertical,
  RefreshCw,
  Star,
  TrendingUp,
} from "lucide-react";

const moderationData = [
  {
    type: "Marketplace",
    from: { name: "Alex Chen", role: "CLIENT", id: "USR-8842" },
    to: { name: "Dr. Sarah Kim", role: "EXPERT", id: "EXP-5512" },
    service: { name: "AI Strategy Consulting", type: "Consulting" },
    rating: 5,
    content: `"Exceptional insights on our AI roadmap."`,
    status: "Published",
  },
  {
    type: "Contract",
    from: { name: "James Wilson", role: "CLIENT", id: "USR-9201" },
    to: { name: "Marcus Rivera", role: "EXPERT", id: "EXP-3319" },
    service: {
      name: "Neural Network Architecture Design",
      type: "Contract",
    },
    rating: 4,
    content: `"Great technical expertise but delivery delayed."`,
    status: "Published",
  },
  {
    type: "Contract",
    from: { name: "Dr. Wei Zhang", role: "EXPERT", id: "EXP-7714" },
    to: { name: "Emily Parker", role: "CLIENT", id: "USR-6723" },
    service: {
      name: "Large Language Model Fine-tuning",
      type: "Contract",
    },
    rating: 3,
    content: `"Client failed to provide required data on time."`,
    status: "Flagged",
    flagDetails: {
      points: -15,
      admin: "ADM-0042",
      date: "2026-06-14 17:00",
    },
  },
];

const StarRating = ({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) => {
  const totalStars = 5;
  return (
    <div className={cn("flex items-center gap-0.5 text-primary", className)}>
      {[...Array(totalStars)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < rating ? "fill-primary" : "fill-transparent",
          )}
        />
      ))}
    </div>
  );
};

export default function ModerationDashboardPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              Review Moderation
            </h1>
            <p className="text-base text-muted-foreground">
              Ensure quality and trust within the marketplace ecosystem.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 size-4" />
              Export Logs
            </Button>
            <Button>
              <RefreshCw className="mr-2 size-4" />
              Refresh Queue
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Stats Sidebar */}
          <aside className="xl:col-span-1 space-y-6 order-1 xl:order-2">
            <Card>
              <CardHeader>
                <CardTitle>Moderation Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Total Pending
                  </p>
                  <p className="text-3xl font-bold text-primary">1,284</p>
                  <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                    <TrendingUp className="size-3.5" />
                    +12% from yesterday
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Avg. Platform Rating
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-bold">4.82</p>
                    <Star className="size-5 text-primary fill-primary" />
                  </div>
                </div>
                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-1">
                    Flagged Reports
                  </p>
                  <p className="text-3xl font-bold text-destructive">42</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Requires immediate attention
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-base">Moderator Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">
                      Active Moderators
                    </span>
                    <span className="font-medium">18</span>
                  </div>
                  <Progress value={75} />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">
                      Queue Completion
                    </span>
                    <span className="font-medium text-primary">92%</span>
                  </div>
                  <Progress value={92} className="[&>div]:bg-primary" />
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Table Content */}
          <div className="xl:col-span-3 order-2 xl:order-1">
            <Card className="p-4 mb-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="text-muted-foreground" />
                  <span className="font-semibold text-sm text-muted-foreground">
                    Filters:
                  </span>
                </div>
                <select className="bg-background border border-input rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-ring">
                  <option>Status: All</option>
                </select>
                <select className="bg-background border border-input rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-ring">
                  <option>Rating: Any</option>
                </select>
                <input
                  className="bg-background border border-input rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-ring"
                  type="date"
                />
                <Button variant="link" className="ml-auto text-primary">
                  Clear all filters
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {moderationData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge
                            variant={
                              item.type === "Contract" ? "default" : "secondary"
                            }
                            className={
                              item.type === "Contract"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300"
                                : ""
                            }
                          >
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{item.from.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.from.role} • {item.from.id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{item.to.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.to.role} • {item.to.id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{item.service.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.service.type}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <StarRating rating={item.rating} className="mb-1.5" />
                          <p
                            className={cn(
                              "text-sm line-clamp-2 italic",
                              item.status === "Flagged"
                                ? "text-destructive font-semibold"
                                : "text-foreground",
                            )}
                          >
                            {item.content}
                          </p>
                          {item.flagDetails && (
                            <div className="mt-2 space-y-1">
                              <Badge variant="destructive" className="text-xs">
                                {item.flagDetails.points} points deducted
                              </Badge>
                              <p className="text-[10px] text-muted-foreground">
                                Flagged by {item.flagDetails.admin} -{" "}
                                {item.flagDetails.date}
                              </p>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.status === "Published"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-0.5">
                          {item.status === "Published" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Approve"
                              >
                                <CheckCircle className="size-5 text-primary" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Flag">
                                <Flag className="size-5 text-destructive" />
                              </Button>
                            </>
                          )}
                          {item.status === "Flagged" && (
                            <>
                              <Button variant="ghost" size="icon" title="Edit">
                                <Edit className="size-5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Hide Review"
                              >
                                <EyeOff className="size-5 text-destructive" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="size-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Pagination */}
              <div className="px-6 py-4 border-t flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Showing <span className="font-bold">1-3</span> of 1,284
                  reviews
                </span>
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="icon" disabled>
                    <ChevronLeft className="size-4" />
                  </Button>
                  <div className="flex gap-1">
                    <Button size="icon" className="w-8 h-8 text-sm">
                      1
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-sm"
                    >
                      2
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-sm"
                    >
                      3
                    </Button>
                    <span className="px-1 self-center">...</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-sm"
                    >
                      321
                    </Button>
                  </div>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
