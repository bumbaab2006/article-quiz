"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Article = {
  id: string;
  title: string;
};

export default function Sidebar() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch("/api/my-articles")
      .then((r) => r.json())
      .then(setArticles)
      .catch((err) => console.error("Error fetching articles:", err));
  }, []);

  return (
    <aside className="w-64 bg-white border-r p-4 flex flex-col">
      <div className="mb-8 px-2">
        <h2 className="text-xl font-bold tracking-tight text-gray-500">
          AI Quizzer
        </h2>
      </div>

      <h2 className="text-xs font-semibold text-gray-500 mb-3 px-2 uppercase tracking-wider">
        Түүх
      </h2>

      <div className="space-y-1 overflow-y-auto">
        {articles.length === 0 ? (
          <p className="text-xs text-gray-400 px-2 italic ">
            Түүх хоосон байна
          </p>
        ) : (
          articles.map((a) => (
            <Link
              key={a.id}
              href={`/dashboard/history/${a.id}`} // Энэ хуудсыг дараа нь хийж болно
              className="block w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors truncate text-gray-500"
            >
              {a.title}
            </Link>
          ))
        )}
      </div>
    </aside>
  );
}
