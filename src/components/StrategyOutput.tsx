"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Target, Users, Rocket, DollarSign, AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export default function StrategyOutput() {
  const { id } = useParams<{ id: string }>();
  const [idea, setIdea] = useState<any>(null);

  useEffect(() => {
    const savedIdeas = localStorage.getItem('ideas');
    if (savedIdeas) {
      const ideas = JSON.parse(savedIdeas);
      const foundIdea = ideas.find((i: any) => i.id === id);
      if (foundIdea) {
        setIdea(foundIdea);
      }
    }
  }, [id]);

  if (!idea) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Idea not found</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Parse the content if it's a string
  let parsedContent = idea.content;
  if (typeof idea.content === 'string') {
    try {
      // Remove markdown code blocks if present
      let cleaned = idea.content.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*\n?/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*\n?/, '');
      }
      if (cleaned.endsWith('```')) {
        cleaned = cleaned.replace(/\n?```\s*$/, '');
      }
      parsedContent = JSON.parse(cleaned.trim());
    } catch (e) {
      console.error('Failed to parse idea content:', e);
      parsedContent = null;
    }
  }

  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    green: "bg-green-50 text-green-700 border-green-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };

  const Section = ({ 
    icon: Icon, 
    title, 
    items, 
    color = "blue" 
  }: { 
    icon: React.ElementType; 
    title: string; 
    items: string[]; 
    color?: keyof typeof colorClasses 
  }) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
            <ul className="space-y-3">
              {items.map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {parsedContent?.title || idea.title || 'Untitled Idea'}
              </h1>
              {idea.description && (
                <p className="text-gray-600">{idea.description}</p>
              )}
              {idea.tags && idea.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {idea.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Created: {new Date(idea.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </header>

      {/* Strategy Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {parsedContent ? (
          <div className="space-y-6">
            {/* Title Card */}
            {parsedContent.title && (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Lightbulb className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">{parsedContent.title}</h2>
                </div>
                <p className="text-blue-100">AI-Generated Strategic Plan</p>
              </div>
            )}

            {/* Problem */}
            <Section 
              icon={Target} 
              title="Problem Statement" 
              items={parsedContent.problem}
              color="red"
            />

            {/* Solution */}
            <Section 
              icon={CheckCircle2} 
              title="Proposed Solution" 
              items={parsedContent.solution}
              color="green"
            />

            {/* MVP */}
            <Section 
              icon={Rocket} 
              title="Minimum Viable Product (MVP)" 
              items={parsedContent.mvp}
              color="purple"
            />

            {/* Go-to-Market */}
            <Section 
              icon={Users} 
              title="Go-to-Market Strategy" 
              items={parsedContent.goToMarket}
              color="blue"
            />

            {/* Monetization */}
            <Section 
              icon={DollarSign} 
              title="Monetization Strategy" 
              items={parsedContent.monetization}
              color="green"
            />

            {/* Risks & Validation */}
            <Section 
              icon={AlertTriangle} 
              title="Risks & Validation" 
              items={parsedContent.risksValidation}
              color="orange"
            />
          </div>
        ) : (
          <div className="bg-white border rounded-2xl p-8 text-center">
            <p className="text-gray-500 mb-4">No strategy content available for this idea.</p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}