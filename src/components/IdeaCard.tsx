"use client";

import { Eye, Trash2, Calendar } from 'lucide-react';
import  { IdeaCardProps } from '../lib/types';
import Link from 'next/link';


export default function IdeaCard({ idea, onDelete }: IdeaCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this idea?')) {
      onDelete(idea.id);
    }
  };

  const snippet = idea.description.length > 120 
    ? idea.description.substring(0, 120) + '...' 
    : idea.description;

  return (
    <section className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden group">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {idea.title}
          </h3>
          {idea.strategy && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
              Strategy Ready
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {snippet}
        </p>

        {idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {idea.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            {new Date(idea.createdAt).toLocaleDateString()}
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              href={`/strategy/${idea.id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
            >
              <Eye className="w-4 h-4" />
              View
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}