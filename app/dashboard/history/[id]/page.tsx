"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function HistoryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-gray-500">Ачаалж байна...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 hover:text-black mb-4"
      >
        ← Буцах
      </button>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h1 className="text-3xl font-bold mb-4 text-gray-500">{data.title}</h1>
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold text-blue-600">AI Хураангуй</h3>
          <p className="text-gray-700 bg-blue-50 p-4 rounded-xl italic">
            {data.summary}
          </p>

          <h3 className="text-lg font-semibold mt-8 text-gray-500">Эх текст</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            {data.content}
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-500">
          Quiz-ийн түүх
        </h3>
        {data.quizzes?.length > 0 ? (
          <div className="space-y-4">
            {data.quizzes.map((quiz: any) => (
              <div key={quiz.id} className="border-t pt-4">
                {quiz.attempts.map((attempt: any) => (
                  <div
                    key={attempt.id}
                    className="flex justify-between items-center py-2"
                  >
                    <span className="text-sm text-gray-600">
                      {new Date(attempt.createdAt).toLocaleDateString()}
                    </span>
                    <span className="font-bold text-lg text-gray-500">
                      Оноо: {attempt.score} / 5
                    </span>
                  </div>
                ))}
                <button
                  onClick={() => router.push(`/dashboard/quiz/${quiz.id}`)}
                  className="mt-2 text-sm bg-black text-white px-4 py-2 rounded-lg"
                >
                  Дахин Quiz өгөх
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">
            Энэ нийтлэл дээр Quiz үүсгээгүй байна.
          </p>
        )}
      </div>
    </div>
  );
}
