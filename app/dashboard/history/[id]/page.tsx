"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function HistoryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Email states
  const [userEmail, setUserEmail] = useState("");
  const [isEmailSending, setIsEmailSending] = useState(false);

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [id]);

  const handleSendEmail = async () => {
    if (!userEmail) return alert("Имэйл хаягаа оруулна уу");
    setIsEmailSending(true);
    try {
      const res = await fetch(
        "https://bumbayar.app.n8n.cloud/webhook-test/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            summary: data.summary,
            title: data.title,
          }),
        }
      );
      if (res.ok) alert("Имэйл амжилттай илгээгдлээ!");
      else alert("Илгээхэд алдаа гарлаа");
    } catch (err) {
      console.error(err);
    } finally {
      setIsEmailSending(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Ачаалж байна...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 hover:text-black mb-4 flex items-center gap-1"
      >
        ← Буцах
      </button>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-gray-500">{data.title}</h1>

        <div className="prose max-w-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-600">
              AI Хураангуй
            </h3>
          </div>
          <p className="text-gray-700 bg-blue-50 p-4 rounded-xl italic leading-relaxed">
            {data.summary}
          </p>

          {/* Email Sender section */}
          <div className="mt-6 flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex-1">
              <input
                type="email"
                placeholder="Энэ хураангуйг имэйлээр авах..."
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full bg-transparent text-sm outline-none text-gray-600 placeholder:text-gray-400"
              />
            </div>
            <button
              onClick={handleSendEmail}
              disabled={isEmailSending}
              className="text-xs font-bold bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 text-gray-600"
            >
              {isEmailSending ? "..." : "Имэйлээр илгээх"}
            </button>
          </div>

          <h3 className="text-lg font-semibold mt-10 text-gray-500">
            Эх текст
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-wrap">
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
              <div
                key={quiz.id}
                className="border-t pt-4 first:border-t-0 first:pt-0"
              >
                {quiz.attempts.map((attempt: any) => (
                  <div
                    key={attempt.id}
                    className="flex justify-between items-center py-2"
                  >
                    <span className="text-sm text-gray-400">
                      {new Date(attempt.createdAt).toLocaleDateString()}
                    </span>
                    <span className="font-bold text-lg text-gray-500">
                      Оноо: {attempt.score} / 5
                    </span>
                  </div>
                ))}
                <button
                  onClick={() => router.push(`/dashboard/quiz/${quiz.id}`)}
                  className="mt-2 text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Дахин Quiz өгөх
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic">
            Энэ нийтлэл дээр Quiz үүсгээгүй байна.
          </p>
        )}
      </div>
    </div>
  );
}
