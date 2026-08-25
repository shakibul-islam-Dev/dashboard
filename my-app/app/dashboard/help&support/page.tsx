"use client";

import React, { useState, useMemo } from "react";
import PathProvider from "@/components/customsUi/PathProvider";
import {
  Search,
  BookOpen,
  HelpCircle,
  Headphones,
  ChevronDown,
  X,
} from "lucide-react";
import RouterNavigation from "@/components/customsUi/RouterNavigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I manage task dependencies?",
    answer:
      "You can manage task dependencies by opening any task detail modal, navigating to the 'Dependencies' tab, and selecting the blocking or dependent tasks from your project list.",
  },
  {
    question: "Can I invite external collaborators?",
    answer:
      "Yes, you can invite external collaborators with restricted permissions from the Team Settings page by sending an email invitation with guest-level access.",
  },
  {
    question: "How do I export project analytics?",
    answer:
      "Go to the Analytics tab, click the export button on the top right, and choose between CSV, PDF, or JSON data format.",
  },
  {
    question: "What are the keyboard shortcuts?",
    answer:
      "Press '?' anywhere in the app to display the full overlay menu of active keyboard shortcuts, including quick task creation, search focus, and navigation.",
  },
];

export default function HelpAndSupport() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ── Search filtering ──
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const query = searchQuery.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6 md:p-10 font-sans text-foreground">
      <RouterNavigation />
      <PathProvider />

      <div className="max-w-4xl mx-auto pt-4">
        {/* Top Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Help & Support
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Find answers and get help with TaskBoard.
          </p>
        </div>

        {/* Search Bar — wrapped in a shadcn Card */}
        <Card className="mb-8">
          <CardContent className="p-2">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 flex items-center pl-3">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <Input
                  type="text"
                  placeholder="Search documentation, tutorials, and FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 pl-3 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-sm hover:bg-muted transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                )}
              </div>
              <Button className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium px-5 py-2 rounded-lg text-sm transition-colors shrink-0 shadow-xs">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 3 Main Action Cards — each wrapped in a shadcn Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {/* Documentation Card */}
          <Card className="relative overflow-hidden group hover:border-border transition-all">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground text-base mb-1.5">
                Documentation
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Browse comprehensive guides, tutorials, and technical product
                documentation.
              </p>
            </CardContent>
          </Card>

          {/* Frequently Asked Questions Card */}
          <Card className="relative overflow-hidden group hover:border-border transition-all">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground text-base mb-1.5">
                Frequently Asked Questions
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Find quick answers to the most common questions from our user
                community.
              </p>
            </CardContent>
          </Card>

          {/* Contact Support Card */}
          <Card className="relative overflow-hidden group hover:border-border transition-all">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground text-base mb-1.5">
                Contact Support
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Need human help? Get directly in touch with the TaskBoard support
                team.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-4">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden transition-colors">
                {/* FAQ toggle — uses shadcn Button with ghost variant */}
                <Button
                  variant="ghost"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 flex items-center justify-between text-left text-sm font-medium text-foreground hover:bg-muted/50 transition-colors rounded-none"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-2 ${
                      openFaq === index ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </Button>

                {openFaq === index && (
                  <CardContent className="px-4 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border">
                    {faq.answer}
                  </CardContent>
                )}
              </Card>
            ))}
            {filteredFaqs.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No FAQs match your search. Try a different query.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
