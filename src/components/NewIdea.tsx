"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  Plus,
  X,
  Target,
  Users,
  Rocket,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIdeaGenerator } from "@/hooks/useIdeaGenerator";

function IdeaOutputDisplay({ ideaData, isStreaming }: any) {
  const parseIdeaData = (rawOutput: any) => {
    try {
      // If it's already an object, return it
      if (typeof rawOutput === "object") return rawOutput;

      // Remove markdown code blocks if present
      let cleaned = rawOutput.trim();

      // Remove ```json at the start and ``` at the end
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/^```json\s*\n?/, "");
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```\s*\n?/, "");
      }

      if (cleaned.endsWith("```")) {
        cleaned = cleaned.replace(/\n?```\s*$/, "");
      }

      // Check if JSON looks incomplete (common signs)
      const hasOpeningBrace = cleaned.includes("{");
      const hasClosingBrace = cleaned.endsWith("}");
      
      if (hasOpeningBrace && !hasClosingBrace) {
        console.log("JSON appears incomplete - still streaming");
        return null;
      }

      // Try to parse as JSON
      const parsed = JSON.parse(cleaned.trim());
      console.log("Successfully parsed JSON");
      return parsed;
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      
      // If not streaming and parsing failed, show the error with raw output
      if (!isStreaming) {
        console.log("Stream completed but JSON is invalid");
        console.log("Raw output:", rawOutput);
        return { error: true, rawOutput, message: (e as Error).message };
      }
      
      // Still streaming, return null to show loading
      return null;
    }
  };

  const idea = parseIdeaData(ideaData);

  // Show clean loading state while streaming
  if (!idea) {
    return (
      <div className="bg-white border rounded-2xl p-6">
        <div className="flex items-center gap-2 text-gray-600">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          <p className="font-medium">Generating your strategic plan...</p>
        </div>
        <p className="text-sm text-gray-500 mt-2">This may take 20-30 seconds</p>
      </div>
    );
  }

  // Show error state if parsing failed after streaming is done
  if (idea.error) {
    return (
      <div className="bg-white border rounded-2xl p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 font-medium">⚠️ Response was incomplete or invalid</p>
          <p className="text-red-600 text-sm mt-1">
            The AI response was cut off before completing. This usually means the response exceeded the token limit.
            Try with a shorter description or simpler idea.
          </p>
          <p className="text-red-600 text-sm mt-2">Error: {idea.message}</p>
        </div>
        <details className="cursor-pointer">
          <summary className="text-sm text-gray-600 font-medium mb-2">Show raw output</summary>
          <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 mt-2">
            {idea.rawOutput}
          </pre>
        </details>
      </div>
    );
  }

  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    green: "bg-green-50 text-green-700 border-green-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    red: "bg-red-50 text-red-700 border-red-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };

  const Section = ({
    icon: Icon,
    title,
    items,
    color = "blue",
  }: {
    icon: React.ElementType;
    title: string;
    items: string[];
    color?: keyof typeof colorClasses;
  }) => {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="text-gray-400 mt-1">•</span>
              <span className="text-gray-700 flex-1">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title Section */}
      {idea.title && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="w-6 h-6" />
            <h2 className="text-2xl font-bold">{idea.title}</h2>
          </div>
          <p className="text-blue-100">AI-Generated Strategic Plan</p>
        </div>
      )}

      {/* Problem */}
      {idea.problem && idea.problem.length > 0 && (
        <Section
          icon={Target}
          title="Problem Statement"
          items={idea.problem}
          color="red"
        />
      )}

      {/* Solution */}
      {idea.solution && idea.solution.length > 0 && (
        <Section
          icon={CheckCircle2}
          title="Proposed Solution"
          items={idea.solution}
          color="green"
        />
      )}

      {/* MVP */}
      {idea.mvp && idea.mvp.length > 0 && (
        <Section
          icon={Rocket}
          title="Minimum Viable Product (MVP)"
          items={idea.mvp}
          color="purple"
        />
      )}

      {/* Go-to-Market */}
      {idea.goToMarket && idea.goToMarket.length > 0 && (
        <Section
          icon={Users}
          title="Go-to-Market Strategy"
          items={idea.goToMarket}
          color="blue"
        />
      )}

      {/* Monetization */}
      {idea.monetization && idea.monetization.length > 0 && (
        <Section
          icon={DollarSign}
          title="Monetization Strategy"
          items={idea.monetization}
          color="green"
        />
      )}

      {/* Risks & Validation */}
      {idea.risksValidation && idea.risksValidation.length > 0 && (
        <Section
          icon={AlertTriangle}
          title="Risks & Validation"
          items={idea.risksValidation}
          color="orange"
        />
      )}
    </div>
  );
}

export default function NewIdea() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const { generate, status, output, error, isGenerating } = useIdeaGenerator();

  const addTag = () => {
    const value = tagInput.trim();
    if (value && !tags.includes(value)) {
      setTags((prev) => [...prev, value]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag));

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleGenerate = async () => {
    await generate(title, description, tags);
  };

  const handleSave = () => {
    if (!output) return;
    const saved = localStorage.getItem("ideas");
    const arr = saved ? JSON.parse(saved) : [];
    arr.unshift({
      id: Date.now().toString(),
      title,
      description,
      tags,
      createdAt: new Date().toISOString(),
      content: output,
    });
    localStorage.setItem("ideas", JSON.stringify(arr));
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">
            Create New Idea
          </h1>
          <p className="text-gray-500 mt-1">
            Describe your idea and let AI generate a strategic plan
          </p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-white shadow-sm rounded-2xl p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idea Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a compelling title for your idea"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={6}
              placeholder="Describe your idea in detail. Include the problem it solves, target users, and unique value proposition..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add tags (press Enter)"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addTag}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-blue-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !title.trim() || !description.trim() || status === "completed"}
            className={`w-full inline-flex items-center justify-center cursor-pointer gap-2 px-6 py-4 rounded-xl transition-all shadow-md
    bg-gradient-to-r from-blue-600 to-purple-600 text-white
    hover:from-blue-700 hover:to-purple-700
    disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating Strategy...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate  Strategy
              </>
            )}
          </button>
        </div>

        {status !== "idle" && (
          <>
            {output && (
              <>
                <IdeaOutputDisplay
                  ideaData={output}
                  isStreaming={isGenerating}
                />

                {status === "completed" && (
                  <button
                    onClick={handleSave}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-xl cursor-pointer hover:bg-green-700 transition-colors"
                  >
                    Save Idea
                  </button>
                )}
              </>
            )}

            {status === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
                <p className="font-medium">Error generating idea</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}