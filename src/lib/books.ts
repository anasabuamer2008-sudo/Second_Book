import { Book } from "@/store/useCartStore";

export const sampleBooks: Book[] = [
  {
    id: "1",
    title: "الرحيق الأختوم",
    author: "عبد الرحم الأصفقاني",
    price: 25,
    condition: "like-new",
    coverImage: "/books/book1.svg",
    description: "كتاب قيّم حول السيرة النبوية، قرأته وراجعته بعناية.",
  },
  {
    id: "2",
    title: "رسائل عالم",
    author: "محمد الغزالي",
    price: 20,
    condition: "good",
    coverImage: "/books/book2.svg",
    description: "كتاب مميز في الفكر الإسلامي المعاصر.",
  },
  {
    id: "3",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    price: 30,
    condition: "like-new",
    coverImage: "/books/book3.svg",
    description: "كتاب مذهل عن علم النفس السلوكي واتخاذ القرارات.",
  },
  {
    id: "4",
    title: "ريادة الأعمال",
    author: "Tim Ferris",
    price: 15,
    condition: "acceptable",
    coverImage: "/books/book4.svg",
    description: "كتاب مفيد لمن يرغب في بدء مشاريعه الخاصة.",
  },
  {
    id: "5",
    title: "The Lean Startup",
    author: "Eric Ries",
    price: 22,
    condition: "good",
    coverImage: "/books/book5.svg",
    description: "منهجية مبتكرة لبناء شركات ناشئة.",
  },
  {
    id: "6",
    title: "تاريخ الطبري",
    author: "ابن جرير الطبري",
    price: 35,
    condition: "like-new",
    coverImage: "/books/book6.svg",
    description: "من أعظم كتب التاريخ الإسلامي الموثقة.",
  },
];

export interface Bundle {
  id: string;
  nameAr: string;
  nameHe: string;
  bookIds: string[];
  bundlePrice: number;
}

export const sampleBundles: Bundle[] = [
  {
    id: "b1",
    nameAr: "باقة الرواد",
    nameHe: "חבילת המופת",
    bookIds: ["1", "2", "6"],
    bundlePrice: 65,
  },
  {
    id: "b2",
    nameAr: "باقة التطوير والإدارة",
    nameHe: "חבילת פיתוח וניהול",
    bookIds: ["3", "4", "5"],
    bundlePrice: 54,
  },
  {
    id: "b3",
    nameAr: "باقة القارئ الشامل",
    nameHe: "חבילת הקורא",
    bookIds: ["1", "3", "6"],
    bundlePrice: 72,
  },
];

export function getBundleTotal(bundle: Bundle): number {
  return bundle.bookIds.reduce((sum, id) => {
    const book = sampleBooks.find((b) => b.id === id);
    return sum + (book?.price ?? 0);
  }, 0);
}

export const DELIVERY_FEE = 15;