import { PrismaClient } from "@prisma/client";

// Prisma Client-ийг singleton болгох функц
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["error", "warn"],
  });
};

// Global төрлийг тодорхойлж өгөх (TypeScript-д зориулж)
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

// Хэрэв global-д байвал түүнийг ашиглана, байхгүй бол шинийг үүсгэнэ
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// Production-оос бусад орчинд global-д хадгална
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
