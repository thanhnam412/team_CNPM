import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BadgeCheck,
  Brain,
  CheckCheck,
  CheckCircle,
  Download,
  FileCheck,
  FileSearch,
  FileText,
  ListChecks,
} from "lucide-react";

export function AiAutoQualityReport() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* AI Auto-Quality Report Component */}
      <Card className="flex flex-col md:flex-row overflow-hidden shadow-sm">
        {/* Left Side: Header & Overview */}
        <div className="bg-muted/30 border-b md:border-b-0 md:border-r p-6 md:p-8 flex flex-col justify-between w-full md:w-1/3">
          <div>
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Brain className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Automated Audit
              </span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
              AI Auto-Quality Report
            </h2>
            <p className="text-sm text-muted-foreground">
              Automated analysis of submission integrity and requirements
              fulfillment.
            </p>
          </div>
          <div className="mt-8">
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Final Result
            </p>
            {/* Custom success badge styling */}
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20">
              <BadgeCheck className="w-6 h-6" />
              <span className="text-2xl font-bold">PASS</span>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Sections */}
        <div className="p-6 md:p-8 w-full md:w-2/3 flex flex-col gap-8">
          {/* Section 1: Technical Validation */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 pb-2 border-b">
              Technical Validation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Build Status */}
              <div className="bg-background p-4 rounded-lg border shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Build Status</span>
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
                </div>
                <span className="text-sm font-semibold text-foreground">Success</span>
              </div>
              {/* Tests */}
              <div className="bg-background p-4 rounded-lg border shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Tests</span>
                  <ListChecks className="w-5 h-5 text-green-600 dark:text-green-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">Pass</span>
                  <span className="text-xs text-muted-foreground">95% Coverage</span>
                </div>
              </div>
              {/* File Integrity */}
              <div className="bg-background p-4 rounded-lg border shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium text-muted-foreground">File Integrity</span>
                  <FileCheck className="w-5 h-5 text-green-600 dark:text-green-500" />
                </div>
                <span className="text-sm font-semibold text-foreground">Files Exist</span>
              </div>
            </div>
          </div>

          {/* Section 2: AI Content Analysis */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 pb-2 border-b">
              AI Content Analysis
            </h3>
            <div className="flex flex-col gap-4">
              {/* Documentation */}
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border shadow-sm">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Documentation Status</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Exists</span>
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
                </div>
              </div>
              {/* Requirement Analysis */}
              <div className="flex flex-col p-4 bg-background rounded-lg border shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FileSearch className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Requirement Analysis</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 border-transparent">
                    100% Match
                  </Badge>
                </div>
                <div className="pl-8">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCheck className="w-4 h-4 text-green-600 dark:text-green-500" />
                    All Requirements Met
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t flex justify-end mt-auto">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download Full Report
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
