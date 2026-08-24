"use client";

import React, { useState } from "react";
import PathProvider from "@/components/customsUi/PathProvider";
import {
  Search,
  BookOpen,
  HelpCircle,
  Headphones,
  ChevronDown,
} from "lucide-react";

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

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6 md:p-10 font-sans text-foreground">
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

        {/* Search Bar */}
        <div className="bg-card border border-border rounded-xl p-2 shadow-xs mb-8">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 flex items-center pl-3">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search documentation, tutorials, and FAQs..."
                className="w-full bg-transparent border-0 pl-3 pr-2 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium px-5 py-2 rounded-lg text-sm transition-colors shrink-0 shadow-xs">
              Search
            </button>
          </div>
        </div>

        {/* 3 Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {/* Documentation Card */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs relative overflow-hidden group hover:border-border transition-all">
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
          </div>

          {/* Frequently Asked Questions Card */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs relative overflow-hidden group hover:border-border transition-all">
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
          </div>

          {/* Contact Support Card */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs relative overflow-hidden group hover:border-border transition-all">
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
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-4">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl shadow-xs overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 flex items-center justify-between text-left text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-2 ${
                      openFaq === index ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                {openFaq === index && (
                  <div className="px-4 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
