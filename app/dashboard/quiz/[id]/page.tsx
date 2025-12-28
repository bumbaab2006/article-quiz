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

  // 1. Quiz-ийн асуултуудыг баазаас авах
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

  // 2. Хариулт сонгох ба үр дүн хадгалах
  const handleAnswer = async (option: string) => {
    const newAnswers = [...selectedAnswers, option];
    setSelectedAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 1. Оноо бодох
      let finalScore = 0;
      questions.forEach((q, index) => {
        if (q.answer === newAnswers[index]) finalScore++;
      });

      setScore(finalScore);
      setIsFinished(true);

      // 2. Бааз руу хадгалах (API Call)
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
        console.log("Үр дүн амжилттай хадгалагдлаа");
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

  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2 text-gray-500">Quiz Дууслаа!</h2>
        <p className="text-gray-500 mb-6">Таны авсан оноо:</p>
        <div className="text-6xl font-black text-black mb-8">
          {score}{" "}
          <span className="text-2xl text-gray-500">/ {questions.length}</span>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 text-gray-500"
          >
            Дахин оролдох
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800"
          >
            Нүүр хуудас руу буцах
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentStep];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
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
