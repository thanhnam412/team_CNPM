"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Eye, MessageSquare, Plus, Save } from "lucide-react";

export default function PlatformConfigurationPage() {
  return (
    <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Platform Configuration
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage core marketplace settings and rules.
            </p>
          </div>
          <Button className="shadow-sm">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Configuration Grid (Bento Style) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left Column (Wider) */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Service Categories Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
                <div className="space-y-1">
                  <CardTitle className="text-xl">Service Categories</CardTitle>
                  <CardDescription>Manage available AI skills.</CardDescription>
                </div>
                <Button variant="link" className="px-0 h-auto font-medium">
                  <Plus className="w-4 h-4 mr-1" /> Add Category
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Category Item: NLP / LLMs */}
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          NLP / LLMs
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Text processing
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  {/* Category Item: Computer Vision */}
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 flex items-center justify-center shrink-0">
                        <Eye className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Computer Vision
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Image analysis
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Milestone Templates Card */}
            <Card>
              <CardHeader className="border-b pb-4 mb-4">
                <CardTitle className="text-xl">Milestone Templates</CardTitle>
                <CardDescription>Default project structures.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-border rounded-lg p-5 bg-background shadow-sm">
                  <h4 className="text-sm font-bold text-foreground mb-4">
                    AI Chatbot Project
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-md border border-border">
                      <span className="w-6 h-6 rounded-full bg-background border shadow-sm text-foreground flex items-center justify-center text-xs font-bold shrink-0">1</span>
                      <span className="text-sm font-medium">Requirement Gathering &amp; Design</span>
                    </div>
                    <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-md border border-border">
                      <span className="w-6 h-6 rounded-full bg-background border shadow-sm text-foreground flex items-center justify-center text-xs font-bold shrink-0">2</span>
                      <span className="text-sm font-medium">Core Engine Development</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Narrower) */}
          <div className="space-y-6">
            
            {/* Pricing Rules Card */}
            <Card>
              <CardHeader className="border-b pb-4 mb-4">
                <CardTitle className="text-xl">Pricing Rules</CardTitle>
                <CardDescription>Platform economics.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="global-fee" className="text-sm font-semibold">Global Platform Fee (%)</Label>
                  <div className="relative">
                    <Input id="global-fee" type="number" defaultValue="15" className="pr-8" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-budget" className="text-sm font-semibold">Minimum Budget ($)</Label>
                  <Input id="min-budget" type="number" defaultValue="500" />
                </div>
              </CardContent>
            </Card>

            {/* Global Policies Card */}
            <Card>
              <CardHeader className="border-b pb-4 mb-4">
                <CardTitle className="text-xl">Global Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group">
                  <Checkbox id="nda-policy" defaultChecked className="mt-0.5" />
                  <div className="space-y-1">
                    <Label htmlFor="nda-policy" className="text-sm font-semibold cursor-pointer group-hover:text-primary transition-colors">
                      Standard NDA Required
                    </Label>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Enforce NDA on all new projects.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </main>
  );
}
