"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quizzes/${id}`);
        if (!res.ok) throw new Error("Quiz-ийг ачаалж чадсангүй");
        const data = await res.json();
        setQuestions(data.questions as Question[]);
      } catch (err) {
        alert("Алдаа гарлаа");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, router]);

  const handleAnswer = async (option: string) => {
    const newAnswers = [...selectedAnswers, option];
    setSelectedAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      let finalScore = 0;
      questions.forEach((q, index) => {
        if (q.answer === newAnswers[index]) finalScore++;
      });

      setScore(finalScore);
      setIsFinished(true);

      try {
        await fetch("/api/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId: id,
            userAnswers: newAnswers,
            score: finalScore,
          }),
        });
      } catch (err) {
        console.error("Үр дүн хадгалахад алдаа гарлаа:", err);
      }
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
      </div>
    );

  // --- ШИНЭЧЛЭГДСЭН ҮР ДҮНГИЙН ХЭСЭГ ---
  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Quiz Дууслаа!
          </h2>
          <p className="text-gray-500 mb-6">Таны авсан оноо:</p>
          <div className="text-6xl font-black text-black mb-8">
            {score}{" "}
            <span className="text-2xl text-gray-400">/ {questions.length}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => window.location.reload()}
              className="py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Дахин оролдох
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Буцах
            </button>
          </div>
        </div>

        {/* Асуулт бүрийн дэлгэрэнгүй тайлбар */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="font-bold text-gray-900">Дэлгэрэнгүй тойм</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {questions.map((q, index) => {
              const isCorrect = q.answer === selectedAnswers[index];
              return (
                <div key={index} className="p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {isCorrect ? (
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className="w-3.5 h-3.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className="w-3.5 h-3.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 leading-tight">
                        {index + 1}. {q.question}
                      </p>
                    </div>
                  </div>

                  <div className="ml-9 space-y-1.5">
                    <p
                      className={`text-sm ${
                        isCorrect ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      <span className="font-medium">Таны хариулт:</span>{" "}
                      {selectedAnswers[index]}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-green-700 bg-green-50/50 py-1 px-3 rounded-lg inline-block">
                        <span className="font-medium">Зөв хариулт:</span>{" "}
                        {q.answer}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- QUIZ ЯВАГДАЖ БАЙГАА ХЭСЭГ (ӨӨРЧЛӨӨГҮЙ) ---
  const q = questions[currentStep];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="w-full bg-gray-200 h-1.5 rounded-full mb-8">
        <div
          className="bg-black h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-8">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Асуулт {currentStep + 1}
          </span>
          <h2 className="text-2xl font-semibold mt-2 text-gray-900 leading-tight">
            {q.question}
          </h2>
        </div>

        <div className="grid gap-3">
          {q.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              className="w-full text-left p-5 border border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-all duration-200 group flex justify-between items-center"
            >
              <span className="font-medium text-gray-700">{option}</span>
              <div className="w-5 h-5 border rounded-full group-hover:border-black transition-colors"></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
