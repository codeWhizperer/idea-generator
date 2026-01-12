"use client";
import { useState, useEffect } from "react";
import { Plus, Search, Lightbulb } from "lucide-react";
import IdeaCard from "./IdeaCard";
import Link from "next/link";
import { Idea } from "../lib/types";



export default function Dashboard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  useEffect(() => {
    const savedIdeas = localStorage.getItem("ideas");
    if (savedIdeas) {
      setIdeas(JSON.parse(savedIdeas));
    }
  }, []);

  const deleteIdea = (id: string) => {
    const updatedIdeas = ideas.filter((idea) => idea.id !== id);
    setIdeas(updatedIdeas);
    localStorage.setItem("ideas", JSON.stringify(updatedIdeas));
  };

  const allTags = Array.from(new Set(ideas.flatMap((idea) => idea.tags)));

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === "all" || idea.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <section className="min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl flex-shrink-0">
                <Lightbulb className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Idea Generator
                </h1>
                <p className="text-sm text-gray-500">
                  AI-Powered Strategy Assistant
                </p>
              </div>
            </div>

            <Link
              href="/new-idea"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 
                   text-white rounded-lg transition-all shadow-md hover:shadow-lg 
                   px-3 sm:px-6 py-3 sm:py-3 font-bold sm:font-semibold"
            >
              <Plus className="w-5 h-5 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">New Idea</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag("all")}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  selectedTag === "all"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    selectedTag === tag
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {filteredIdeas.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-12 max-w-md mx-auto shadow-sm border border-gray-100">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery || selectedTag !== "all"
                  ? "No ideas found"
                  : "No ideas yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || selectedTag !== "all"
                  ? "Try adjusting your search or filters"
                  : "Start by creating your first idea"}
              </p>
              {!searchQuery && selectedTag === "all" && (
                <Link
                  href="/new-idea"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Idea
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} onDelete={deleteIdea} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
