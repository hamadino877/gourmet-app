import { useState, useMemo, useCallback, useRef, useEffect } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────
const WA_NUMBER      = "971554099255";
const PHONE_NUMBER   = "0554099255";
const ADMIN_PASSWORD = "0123456";
const ADDRESS        = "دبي، البرشاء جنوب الثالثة، أرجان، بناية روز بالاس، محل رقم 15";
const SOCIAL = {
facebook:  "https://www.facebook.com/alnilegourmet/",
instagram: "https://www.instagram.com/al_nile_gourmet",
tiktok:    "https://www.tiktok.com/@nile.gourmet",
talabat:   "https://www.talabat.com/uae/restaurant/731697/alnil-gourmet-al-barsha-south?aid=6822",
deliveroo: "https://deliveroo.ae/menu/dubai/south-barsha-arjan/al-nile-gourmet",
noon:      "https://food.noon.com/uae-ar/outlet/LNLGRMZMHT/",
};

// ─── WORKING HOURS ────────────────────────────────────────────────────
// FIX: ساعات العمل ديناميكية بدل "مفتوح الآن" الثابتة
function getShopStatus() {
const now = new Date();
const hour = now.getHours();
const minute = now.getMinutes();
const totalMins = hour * 60 + minute;
const openMins  = 11 * 60;      // 11:00 ص
const closeMins = 23 * 60;      // 11:00 م
const isOpen = totalMins >= openMins && totalMins < closeMins;
if (isOpen) {
const remaining = closeMins - totalMins;
if (remaining <= 60) return { open: true, label: `🟡 يغلق خلال ${remaining} دقيقة` };
return { open: true, label: "🟢 مفتوح الآن" };
} else {
const minsUntilOpen = totalMins < openMins
? openMins - totalMins
: (24 * 60 - totalMins) + openMins;
const hoursLeft = Math.floor(minsUntilOpen / 60);
const minsLeft  = minsUntilOpen % 60;
if (hoursLeft === 0) return { open: false, label: `🔴 يفتح خلال ${minsLeft} دقيقة` };
return { open: false, label: `🔴 مغلق — يفتح ${hoursLeft}:${String(minsLeft).padStart(2,"0")}` };
}
}

// ─── PHONE VALIDATION ─────────────────────────────────────────────────
// FIX: التحقق من رقم الهاتف
function validatePhone(phone) {
if (!phone) return true; // اختياري
const cleaned = phone.replace(/[\s-()]/g, "");
// يقبل: +971XXXXXXXXX أو 05XXXXXXXX أو 971XXXXXXXXX
return /^(+971|971|0)[0-9]{8,9}$/.test(cleaned);
}

// ─── LOCAL STORAGE ────────────────────────────────────────────────────
// FIX: حفظ البيانات في localStorage
function loadFromStorage(key, fallback) {
try {
const stored = localStorage.getItem(key);
return stored ? JSON.parse(stored) : fallback;
} catch { return fallback; }
}
function saveToStorage(key, value) {
try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── IMAGES ──────────────────────────────────────────────────────────
const I = [
"https://i.ibb.co/6c69xgdQ/mixboard-image-1.png",   // 0
"https://i.ibb.co/b5PrSg0G/mixboard-image-2.png",   // 1
"https://i.ibb.co/mrLK9s3Z/mixboard-image-3.png",   // 2
"https://i.ibb.co/DPdZzLSk/mixboard-image-4.png",   // 3
"https://i.ibb.co/0yvCbC4T/mixboard-image-5.png",   // 4
"https://i.ibb.co/mCc7Lyv2/mixboard-image-6.png",   // 5
"https://i.ibb.co/W4XwXYwV/mixboard-image-7.png",   // 6
"https://i.ibb.co/DP0VByDC/mixboard-image-8.png",   // 7
"https://i.ibb.co/zVP05rC9/mixboard-image-9.png",   // 8
"https://i.ibb.co/5X9JDQ50/mixboard-image-10.png",  // 9
"https://i.ibb.co/pv5YPdGZ/mixboard-image-11.png",  // 10
"https://i.ibb.co/tMH1pHyZ/mixboard-image-12.png",  // 11
"https://i.ibb.co/0ygXDzM7/mixboard-image-13.png",  // 12
"https://i.ibb.co/ZzQ9VQhc/mixboard-image-14.png",  // 13
"https://i.ibb.co/TBMnT6w1/mixboard-image-15.png",  // 14
"https://i.ibb.co/CKyN6K2L/mixboard-image-16.png",  // 15
"https://i.ibb.co/CKyN6K2L/mixboard-image-16.png",  // 16
"https://i.ibb.co/qLJFq3gc/mixboard-image-18.png",  // 17
"https://i.ibb.co/LzvBZmGb/mixboard-image-19.png",  // 18
"https://i.ibb.co/60f1mcZP/mixboard-image-20.png",  // 19
"https://i.ibb.co/7JjFww6Y/mixboard-image-21.png",  // 20
"https://i.ibb.co/XH7xgCQ/mixboard-image-22.png",   // 21
"https://i.ibb.co/kg9h3YcC/mixboard-image-23.png",  // 22
"https://i.ibb.co/V0vHTzfD/mixboard-image-24.png",  // 23
"https://i.ibb.co/tw7RZS8c/mixboard-image-25.png",  // 24
"https://i.ibb.co/XxmbSrmn/mixboard-image-26.png",  // 25
"https://i.ibb.co/XxmbSrmn/mixboard-image-26.png",  // 26
"https://i.ibb.co/XxmbSrmn/mixboard-image-26.png",  // 27
"https://i.ibb.co/XxmbSrmn/mixboard-image-26.png",  // 28
"https://i.ibb.co/gF3kfqdL/mixboard-image-30.png",  // 29
"https://i.ibb.co/wNPjkhKd/mixboard-image-31.png",  // 30
"https://i.ibb.co/ym5t3ffr/mixboard-image-32.png",  // 31
"https://i.ibb.co/23vry85M/mixboard-image-74.png",  // 32
"https://i.ibb.co/6RTCnfPH/mixboard-image-68.png",  // 33
"https://i.ibb.co/WWGL1QcG/mixboard-image-79.png",  // 34
"https://i.ibb.co/J9kxNLn/mixboard-image-67.png",   // 35
"https://i.ibb.co/0pHGfmdS/mixboard-image-78.png",  // 36
"https://i.ibb.co/WWGL1QcG/mixboard-image-79.png",  // 37
"https://i.ibb.co/hFsQZPTb/mixboard-image-76.png",  // 38
"https://i.ibb.co/SXKfdWsx/mixboard-image-77.png",  // 39
"https://i.ibb.co/GQKt9G9m/mixboard-image-71.png",  // 40
"https://i.ibb.co/TDfh2Vc2/mixboard-image-75.png",  // 41
"https://i.ibb.co/ym2LDbWc/mixboard-image-72.png",  // 42
"https://i.ibb.co/wFmcVXmf/mixboard-image-69.png",  // 43
"https://i.ibb.co/Bk72PbY/mixboard-image-80.png",   // 44
"https://i.ibb.co/c90wmY1/mixboard-image-81.png",   // 45
"https://i.ibb.co/dJxNXZdc/mixboard-image-82.png",  // 46
"https://i.ibb.co/RpTfV6FZ/mixboard-image-83.png",  // 47
"https://i.ibb.co/RwN6byF/mixboard-image-84.png",   // 48
"https://i.ibb.co/RwN6byF/mixboard-image-84.png",   // 49
"https://i.ibb.co/4n3VqVpr/mixboard-image-86.png",  // 50
"https://i.ibb.co/kY4CB3R/mixboard-image-87.png",   // 51
"https://i.ibb.co/1GJYqwjp/mixboard-image-89.png",  // 52
"https://i.ibb.co/9mx7rGS2/mixboard-image-88.png",  // 53
"https://i.ibb.co/sdnMTyBt/mixboard-image-90.png",  // 54
"https://i.ibb.co/sdnMTyBt/mixboard-image-90.png",  // 55
"https://i.ibb.co/hR7pGkTj/mixboard-image-91.png",  // 56
"https://i.ibb.co/C5MxJ9cT/mixboard-image-92.png",  // 57
"https://i.ibb.co/k249Wq6B/mixboard-image-93.png",  // 58
"https://i.ibb.co/VcZCHRHY/mixboard-image-94.png",  // 59
"https://i.ibb.co/4r1yF1Q/mixboard-image-95.png",   // 60
"https://i.ibb.co/HTJhFt3B/mixboard-image-96.png",  // 61
"https://i.ibb.co/s9qHyG7Q/mixboard-image-97.png",  // 62
"https://i.ibb.co/LznHXLNB/mixboard-image-98.png",  // 63
"https://i.ibb.co/JRYNLDn0/mixboard-image-99.png",  // 64
"https://i.ibb.co/kVqQw7Vp/mixboard-image-100.png", // 65
"https://i.ibb.co/LdyMzGdB/mixboard-image-101.png", // 66
"https://i.ibb.co/XZXvxHQG/mixboard-image-102.png", // 67
"https://i.ibb.co/4wgYYMzJ/mixboard-image-103.png", // 68
"https://i.ibb.co/hRPJCxqw/mixboard-image-104.png", // 69
"https://i.ibb.co/x8PG0pCC/mixboard-image-105.png", // 70
"https://i.ibb.co/8nXQ0BTn/mixboard-image-106.png", // 71
"https://i.ibb.co/gLL0YQzX/mixboard-image-107.png", // 72
"https://i.ibb.co/sJWxDqQY/mixboard-image-108.png", // 73
"https://i.ibb.co/SFL1ZqZ/mixboard-image-109.png",  // 74
"https://i.ibb.co/bR158Cs6/mixboard-image-110.png", // 75
"https://i.ibb.co/jPKqFVPF/mixboard-image-111.png", // 76
"https://i.ibb.co/jmLYHQH/mixboard-image-112.png",  // 77
"https://i.ibb.co/CsH8gG6T/mixboard-image-113.png", // 78
"https://i.ibb.co/Swk7mnjG/mixboard-image-114.png", // 79
"https://i.ibb.co/s9YRBvL5/mixboard-image-115.jpg", // 80
"https://i.ibb.co/jPKqFVPF/mixboard-image-111.png", // 81
"https://i.ibb.co/TMc8w1b9/mixboard-image-117.png", // 82
"https://i.ibb.co/dwc9cH0T/mixboard-image-118.png", // 83
"https://i.ibb.co/1G0nQH1K/mixboard-image-119.png", // 84
];

const P = {
beef:       [I[67], I[68], I[68], I[70], I[71], I[72], I[73], I[74], I[75], I[76], I[77], I[78], I[79], I[80], I[81], I[82], I[83], I[84]],
naimi:      I.slice(32, 38),
aus:        I.slice(32, 38),
chicken:    I.slice(36, 47),
grillReady: I.slice(32, 40),
fryReady:   I.slice(32, 45),
soups:      [I[0],  I[1],  I[2]],
salads:     [I[3],  I[4],  I[5],  I[6],  I[7]],
hot:        [I[8],  I[9],  I[10], I[11]],
mahashi:    [I[12], I[13], I[14], I[15], I[16]],
nile:       [I[17], I[18], I[19], I[20], I[21], I[22], I[23], I[24], I[25], I[26], I[27], I[28], I[29], I[30], I[31]],
grills:     [I[32], I[33], I[34], I[35], I[36], I[37], I[38], I[39], I[40], I[41], I[42], I[43]],
tageen:     [I[44], I[45], I[46], I[47], I[48], I[49], I[50], I[51], I[52], I[53], I[54], I[55], I[56], I[57], I[58]],
feteer:     [I[59], I[60], I[61], I[62], I[63]],
sides:      [I[64],  I[65],  I[66]],
};

const pi = (pool, idx) => pool[idx % pool.length];

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%231E1E1E'/%3E%3Ctext x='100' y='110' font-size='50' text-anchor='middle' fill='%23C9A227'%3E%F0%9F%8D%96%3C/text%3E%3C/svg%3E";

const parsePrice = (s) => parseFloat(String(s).replace(/[^\d.]/g, "")) || 0;

// ─── RAW DATA ─────────────────────────────────────────────────────────
const rawButcher = [
{ section: "beef", title: "اللحوم البقري", titleEn: "Beef", pool: "beef", items: [
{ ar: "انتركوت",              en: "Entrecôte",            price: "75 درهم"  },
{ ar: "مكعبات لحم",           en: "Beef Cubes",            price: "60 درهم"  },
{ ar: "لحم مفروم",            en: "Minced Meat",           price: "60 درهم"  },
{ ar: "روستو",                en: "Roast Beef",             price: "60 درهم"  },
{ ar: "بيكاتا",               en: "Piccata",                price: "60 درهم"  },
{ ar: "بوفتيك",               en: "Buftek",                 price: "60 درهم"  },
{ ar: "بيف استروجانوف",        en: "Beef Stroganoff",        price: "60 درهم"  },
{ ar: "شاورما اللحم",          en: "Meat Shawarma",          price: "60 درهم"  },
{ ar: "فيليه أستيك",           en: "Steak Fillet",           price: "115 درهم" },
{ ar: "كبدة بقري",             en: "Sliced Liver",           price: "58 درهم"  },
{ ar: "ريش بتلو",              en: "Beef Chops",             price: "80 درهم"  },
{ ar: "ريب آي",                en: "Ribeye",                 price: "75 درهم"  },
{ ar: "موزة بقري بدون عظم",    en: "Beef Shank boneless",    price: "60 درهم"  },
{ ar: "موزة بقري بالعظم",      en: "Beef Shank with bone",   price: "58 درهم"  },
{ ar: "كبدة إسكندراني",        en: "Alexandrian Liver",      price: "58 درهم"  },
{ ar: "رقبة بتلو",             en: "Neck Beef",              price: "58 درهم"  },
{ ar: "عكاوي",                 en: "Oxtail",                 price: "42 درهم"  },
{ ar: "كوارع",                 en: "Trotters",               price: "35 درهم"  },
]},
{ section: "naimi", title: "لحوم ضاني نعيمي", titleEn: "Naimi Lamb", pool: "naimi", items: [
{ ar: "موزة ضاني نعيمي",       en: "Naimi Lamb Shank",       price: "69 درهم"  },
{ ar: "كتف ضاني نعيمي",        en: "Naimi Lamb Shoulder",    price: "68 درهم"  },
{ ar: "ريش ضاني نعيمي",        en: "Naimi Lamb Chops",       price: "115 درهم" },
{ ar: "خروف نعيمي بدون عظم",   en: "Naimi Lamb boneless",    price: "79 درهم"  },
{ ar: "فخذة ضاني نعيمي",       en: "Naimi Lamb Leg",         price: "68 درهم"  },
{ ar: "رقبة ضاني نعيمي",       en: "Naimi Lamb Neck",        price: "68 درهم"  },
]},
{ section: "aus", title: "لحوم ضاني أسترالي", titleEn: "Australian Lamb", pool: "aus", items: [
{ ar: "رقبة ضاني أسترالي",     en: "Aus. Lamb Neck",         price: "58 درهم"  },
{ ar: "فخذة ضاني أسترالي",     en: "Aus. Lamb Leg",          price: "58 درهم"  },
{ ar: "كتف ضاني أسترالي",      en: "Aus. Lamb Shoulder",     price: "58 درهم"  },
{ ar: "لحم أسترالي بدون عظم",  en: "Aus. Lamb boneless",     price: "70 درهم"  },
{ ar: "ريش ضاني أسترالي",      en: "Aus. Lamb Chops",        price: "115 درهم" },
{ ar: "موزة ضاني أسترالي",     en: "Aus. Lamb Shank",        price: "60 درهم"  },
]},
{ section: "chicken", title: "دجاج وطيور", titleEn: "Poultry", pool: "chicken", items: [
{ ar: "أفخاذ بالعظم",          en: "Chicken Thighs",         price: "38 درهم" },
{ ar: "دجاج مكعبات",           en: "Chicken Cubes",          price: "45 درهم" },
{ ar: "صدور دجاج أستيك",        en: "Chicken Steak",          price: "45 درهم" },
{ ar: "صدور دجاج مخلية",        en: "Chicken Breast",         price: "45 درهم" },
{ ar: "دجاجة كاملة",            en: "Full Chicken",           price: "25 درهم" },
{ ar: "جوز حمام مصري",          en: "Egyptian Pigeons",       price: "50 درهم" },
{ ar: "دجاج بلدي مصري",         en: "Egyptian Chicken",       price: "45 درهم" },
{ ar: "بط بلدي مصري",           en: "Egyptian Duck",          price: "45 درهم" },
{ ar: "أرنب بلدي مصري",         en: "Egyptian Rabbit",        price: "46 درهم" },
{ ar: "ديك رومي أمريكي",        en: "American Turkey",        price: "39 درهم" },
{ ar: "ديك رومي مصري",          en: "Egyptian Turkey",        price: "47 درهم" },
]},
{ section: "grill-ready", title: "جاهز للشواء", titleEn: "Ready-to-Grill", pool: "grillReady", items: [
{ ar: "ستيك فيليه متبل",        en: "Marinated Steak Fillet",   price: "115 درهم" },
{ ar: "سجق متبل",               en: "Marinated Sausages",       price: "58 درهم"  },
{ ar: "كبدة شرايح متبلة",        en: "Marinated Liver",          price: "60 درهم"  },
{ ar: "طرب متبل",               en: "Marinated Tarb",           price: "60 درهم"  },
{ ar: "ريش متبلة",              en: "Marinated Lamb Chops",     price: "115 درهم" },
{ ar: "كفتة متبلة",             en: "Marinated Kofta",          price: "58 درهم"  },
{ ar: "كباب متبل",              en: "Marinated Kabab",          price: "100 درهم" },
{ ar: "ريب آي متبل",            en: "Marinated Ribeye",         price: "78 درهم"  },
{ ar: "شيش طاووق متبل",         en: "Marinated Shish Taoug",    price: "45 درهم"  },
{ ar: "رغيف حواوشي بلدي",       en: "Hawawshi Meat",            price: "13 درهم"  },
{ ar: "برجر فراخ",              en: "Chicken Burger",           price: "45 درهم"  },
{ ar: "برجر واجيو",             en: "Wagyu Burger",             price: "80 درهم"  },
{ ar: "دجاج كامل متبل",         en: "Marinated Whole Chicken",  price: "45 درهم"  },
{ ar: "ستيك دجاج متبل",         en: "Marinated Chicken Steak",  price: "45 درهم"  },
{ ar: "أفخاذ دجاج متبلة",        en: "Marinated Chicken Thighs", price: "50 درهم"  },
{ ar: "شيش طاووق أفخاذ",         en: "Shish Tawook Thighs",      price: "50 درهم"  },
]},
{ section: "fry-ready", title: "جاهز على التحمير", titleEn: "Ready-to-Fry", pool: "fryReady", items: [
{ ar: "كفتة فراخ بانيه",        en: "Chicken Kofta Pane",     price: "50 درهم" },
{ ar: "كفتة لحمة بانيه",        en: "Meat Kofta Pane",        price: "50 درهم" },
{ ar: "اسكالوب فراخ",           en: "Chicken Escalope",       price: "45 درهم" },
{ ar: "اسكالوب لحمة",           en: "Meat Escalope",          price: "60 درهم" },
{ ar: "فرخة محشية رز",          en: "Chicken Stuffed Rice",   price: "35 درهم" },
{ ar: "جوز حمام بالفريك",        en: "Pigeon Freekeh",         price: "75 درهم" },
{ ar: "جوز حمام بالأرز",         en: "Pigeon Rice",            price: "73 درهم" },
{ ar: "كفتة رز",                en: "Rice Kofta",             price: "48 درهم" },
{ ar: "شاورما لحم",             en: "Beef Shawarma",          price: "62 درهم" },
{ ar: "شاورما دجاج",            en: "Chicken Shawarma",       price: "45 درهم" },
{ ar: "كبدة إسكندراني",         en: "Alexandrian Liver",      price: "60 درهم" },
{ ar: "كبدة بالردة",            en: "Breaded Liver",          price: "60 درهم" },
{ ar: "ممبار",                  en: "Mumbar",                 price: "60 درهم" },
]},
];

const rawRestaurant = [
{ section: "soups",   title: "الشوربة",            titleEn: "Soups",            pool: "soups",   items: [
{ ar: "شوربة عدس",            en: "Lentil Soup",    price: "15 درهم" },
{ ar: "شوربة لسان عصفور",      en: "Orzo Soup",      price: "15 درهم" },
{ ar: "شوربة كوارع",           en: "Trotters Soup",  price: "25 درهم" },
]},
{ section: "salads",  title: "السلطات والمقبلات",  titleEn: "Salads",           pool: "salads",  items: [
{ ar: "سلطة بلدي",  en: "Baladi Salad",   price: "15 درهم" },
{ ar: "حمص",        en: "Hummus",          price: "20 درهم" },
{ ar: "بابا غنوج",  en: "Baba Ghanoush",   price: "20 درهم" },
{ ar: "طحينة",      en: "Tahini",          price: "18 درهم" },
{ ar: "تومية",      en: "Toum",            price: "18 درهم" },
]},
{ section: "hot",     title: "مقبلات ساخنة",       titleEn: "Hot Appetizers",   pool: "hot",     items: [
{ ar: "كبدة إسكندراني",  en: "Alexandrian Liver",   price: "31.99 درهم" },
{ ar: "سجق إسكندراني",   en: "Alexandrian Sausage", price: "31.99 درهم" },
{ ar: "فراخ محمرة ١/٤",  en: "Fried Chicken 1/4",   price: "15 درهم"    },
{ ar: "بطاطس مقلية",     en: "French Fries",        price: "15 درهم"    },
]},
{ section: "mahashi", title: "المحاشي",             titleEn: "Mahashi",          pool: "mahashi", items: [
{ ar: "ورق عنب",            en: "Grape Leaves",       price: "30 درهم" },
{ ar: "ممبار",              en: "Mombar",             price: "40 درهم" },
{ ar: "محشي كرنب",          en: "Stuffed Cabbage",    price: "30 درهم" },
{ ar: "محاشي مشكلة",        en: "Mixed Mahashi",      price: "40 درهم" },
{ ar: "محاشي مشكلة ١ كيلو", en: "Mixed Mahashi 1KG", price: "70 درهم" },
]},
{ section: "nile",    title: "أطباق النيل المميزة", titleEn: "Nile Specialties", pool: "nile",    items: [
{ ar: "مكرونة بشاميل",            en: "Béchamel Pasta",            price: "35 درهم"  },
{ ar: "معكرونة بالسجق الشرقي",     en: "Pasta Oriental Sausage",    price: "35 درهم"  },
{ ar: "رقاق باللحم المفروم",        en: "Minced Meat Ragaq",         price: "30 درهم"  },
{ ar: "إسكالوب دجاج",             en: "Chicken Escalope",          price: "35 درهم"  },
{ ar: "فتة بمكعبات لحم بقري",      en: "Fattah Beef Cubes",         price: "55 درهم"  },
{ ar: "فتة موزة ضاني",            en: "Fattah Lamb Shank",         price: "60 درهم"  },
{ ar: "فتة مع كوارع",             en: "Fattah Trotters",           price: "55 درهم"  },
{ ar: "دجاجة كاملة محشوة",         en: "Whole Stuffed Chicken",     price: "50 درهم"  },
{ ar: "حمام محشو بالأرز (حبة)",    en: "Stuffed Pigeon Rice (1pc)", price: "55 درهم"  },
{ ar: "حمام محشو بالأرز (حبتان)",  en: "Stuffed Pigeon Rice (2pc)", price: "105 درهم" },
{ ar: "حمام محشو بالفريك (حبة)",   en: "Pigeon Freek (1pc)",        price: "55 درهم"  },
{ ar: "حمام محشو بالفريك (حبتان)", en: "Pigeon Freek (2pc)",        price: "110 درهم" },
{ ar: "نصف بطة مع محاشي",         en: "Half Duck with Mahashi",    price: "110 درهم" },
{ ar: "نصف بطة مشوية بالفرن",      en: "Half Roasted Duck",         price: "100 درهم" },
{ ar: "كتف ضأني بالفرن",           en: "Baked Lamb Shoulder",       price: "200 درهم" },
]},
{ section: "grills",  title: "المشويات",            titleEn: "Grills",           pool: "grills",  items: [
{ ar: "كباب",              en: "Kebab",                  price: "59 درهم",  variants: [{ l: "نص كيلو", v: "87.5 درهم" }, { l: "كيلو", v: "175 درهم" }] },
{ ar: "كفتة",              en: "Kofta",                  price: "55 درهم",  variants: [{ l: "نص كيلو", v: "80 درهم"   }, { l: "كيلو", v: "160 درهم" }] },
{ ar: "ريش ضاني مشوية",    en: "Grilled Lamb Chops",     price: "60 درهم",  variants: [{ l: "نص كيلو", v: "92.5 درهم" }, { l: "كيلو", v: "185 درهم" }] },
{ ar: "طرب",               en: "Tarab",                  price: "55 درهم",  variants: [{ l: "نص كيلو", v: "82.5 درهم" }, { l: "كيلو", v: "165 درهم" }] },
{ ar: "شيش طاووق",         en: "Shish Tawook",           price: "50 درهم",  variants: [{ l: "نص كيلو", v: "62.5 درهم" }, { l: "كيلو", v: "125 درهم" }] },
{ ar: "مشاوي مشكلة النيل", en: "Nile Mixed Grills",      price: "59 درهم",  variants: [{ l: "نص كيلو", v: "87.5 درهم" }, { l: "كيلو", v: "175 درهم" }] },
{ ar: "مشاوي مشكلة لحوم",  en: "Mixed Meat Grills",      price: "60 درهم",  variants: [{ l: "نص كيلو", v: "90 درهم"   }, { l: "كيلو", v: "180 درهم" }] },
{ ar: "كبدة مشوية",        en: "Grilled Liver",          price: "40 درهم" },
{ ar: "سجق مشوي",          en: "Grilled Sausage",        price: "45 درهم" },
{ ar: "حواوشي",            en: "Hawawshi",               price: "22 درهم" },
{ ar: "صدور دجاج مشوية",   en: "Grilled Chicken Breast", price: "40 درهم" },
{ ar: "موزة مشوية",        en: "Grilled Lamb Shank",     price: "60 درهم" },
{ ar: "نص فرخة مشوية",     en: "Half Grilled Chicken",   price: "35 درهم" },
]},
{ section: "tageen",  title: "طواجن وخضار",         titleEn: "Tagens",           pool: "tageen",  items: [
{ ar: "ملوخية سادة",               en: "Plain Molokhia",         price: "38 درهم" },
{ ar: "ملوخية مع دجاج مقلي",        en: "Molokhia Fried Chicken", price: "49 درهم" },
{ ar: "ملوخية مع مكعبات لحم",       en: "Molokhia Fried Meat",    price: "54 درهم" },
{ ar: "طاجن مسقعة باللحم المفروم",  en: "Moussaka Minced Meat",   price: "40 درهم" },
{ ar: "طاجن بطاطس سادة",            en: "Plain Potato Tagen",     price: "35 درهم" },
{ ar: "طاجن بطاطس بالدجاج",         en: "Potato Tagen Chicken",   price: "45 درهم" },
{ ar: "طاجن بطاطس باللحم",          en: "Potato Tagen Meat",      price: "45 درهم" },
{ ar: "ورقة لحمة",                  en: "War'et Lahma",           price: "50 درهم" },
{ ar: "طاجن بامية سادة",            en: "Plain Okra Tagen",       price: "35 درهم" },
{ ar: "طاجن بامية باللحم",          en: "Okra Tagen Meat",        price: "45 درهم" },
{ ar: "طاجن لحم بالبصل",            en: "Meat Tagen Onion",       price: "45 درهم" },
{ ar: "عكاوي بالبصل",               en: "Akawi Onion",            price: "46 درهم" },
{ ar: "أرز معمر سادة",              en: "Plain Maamar Rice",      price: "30 درهم" },
{ ar: "أرز معمر باللحم",            en: "Maamar Rice Meat",       price: "50 درهم" },
{ ar: "ورق عنب بالكوارع",           en: "Grape Leaves Trotters",  price: "50 درهم" },
]},
{ section: "feteer",  title: "الفطير المصري",       titleEn: "Egyptian Feteer",  pool: "feteer",  items: [
{ ar: "فطيرة مشلتت سادة",   en: "Plain Feteer Meshaltet",  price: "69 درهم" },
{ ar: "فطيرة مكس جبن",      en: "Mixed Cheese Feteer",     price: "49 درهم" },
{ ar: "فطيرة مكس لحوم",     en: "Mixed Meat Feteer",       price: "59 درهم" },
{ ar: "فطيرة خضار مشكلة",   en: "Mixed Vegetable Feteer",  price: "49 درهم" },
{ ar: "فطيرة حلو النيل",    en: "Nile Sweet Feteer",       price: "55 درهم" },
]},
{ section: "sides",   title: "أطباق جانبية",        titleEn: "Sides",            pool: "sides",   items: [
{ ar: "أرز بالشعيرية", en: "Vermicelli Rice", price: "15 درهم" },
{ ar: "أرز أبيض",      en: "White Rice",      price: "15 درهم" },
{ ar: "رز بالخلطة",    en: "Mixed Rice",      price: "18 درهم" },
]},
];

const INIT_REVIEWS = [
{ name: "أحمد محمد",     rating: 5, text: "أفضل لحمة في دبي! الجودة ممتازة والتوصيل سريع. ما شاء الله على المكان.", date: "قبل يومين",   avatar: "أ" },
{ name: "سارة الأنصاري", rating: 5, text: "الأكل زي بيتنا في مصر 😭❤️ المشاوي رائعة وحجم الطبق كبير بالسعر ده.", date: "قبل أسبوع",   avatar: "س" },
{ name: "محمد خالد",     rating: 5, text: "الملحمة ممتازة، اللحمة طازة والتقطيع احترافي. هنطلب تاني إن شاء الله",  date: "قبل أسبوعين", avatar: "م" },
{ name: "نور الدين",     rating: 4, text: "المطعم جميل والطعام لذيذ. الخدمة سريعة. أنصح بالفتة والمشاوي!",         date: "قبل شهر",     avatar: "ن" },
{ name: "ريم العلي",     rating: 5, text: "طلبت حمام محشي وكان خرافي! أفضل حاجة أكلتها في دبي من بعيد 🔥",         date: "قبل شهر",     avatar: "ر" },
];

// ─── DATA BUILD ───────────────────────────────────────────────────────
function buildData(raw, type) {
const cats = [];
const items = [];
raw.forEach(sec => {
const cid  = `${type}_${sec.section}`;
const pool = P[sec.pool] || I;
cats.push({ id: cid, name: sec.title, nameEn: sec.titleEn, type });
sec.items.forEach((item, idx) => {
items.push({
id: `${cid}_${idx}`, cid,
name: item.ar, nameEn: item.en,
price: parsePrice(item.price), priceStr: item.price,
img: pi(pool, idx),
variants: item.variants || null, type,
available: true,
});
});
});
return { cats, items };
}

const butcherBase    = buildData(rawButcher,    "butcher");
const restaurantBase = buildData(rawRestaurant, "restaurant");
const BASE_ITEMS = […butcherBase.items, …restaurantBase.items];
const ALL_CATS   = […butcherBase.cats,  …restaurantBase.cats];

const INIT_ADMIN = BASE_ITEMS.reduce((acc, it) => {
acc[it.id] = { available: true, price: it.price, priceStr: it.priceStr, img: it.img };
return acc;
}, {});

// ─── ICONS ────────────────────────────────────────────────────────────
const IconCart   = ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
const IconHome   = ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconOrders = ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const IconMenu   = ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>;
const IconInfo   = ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IconSearch = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const IconPlus   = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconMinus  = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconBack   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const IconCheck  = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconWa     = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.112 1.523 5.837L.057 23.882l6.19-1.443A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.787 9.787 0 01-5.002-1.375l-.36-.213-3.714.865.93-3.617-.234-.373A9.786 9.786 0 012.182 12C2.182 6.565 6.565 2.182 12 2.182S21.818 6.565 21.818 12 17.435 21.818 12 21.818z"/></svg>;
const IconStar   = ({ filled, size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#C9A227" : "none"} stroke="#C9A227" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconAdmin  = ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const IconEdit   = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;

// ─── BRAND ICONS ──────────────────────────────────────────────────────
const IconFacebook = () => (
<svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
</svg>
);
const IconInstagram = () => (
<svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
<stop offset="0%" stopColor="#FED373"/>
<stop offset="30%" stopColor="#F15245"/>
<stop offset="60%" stopColor="#D92E7F"/>
<stop offset="100%" stopColor="#515ECF"/>
</linearGradient>
</defs>
<path fill="url(#ig)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
</svg>
);
const IconTikTok = () => (
<svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
</svg>
);

const LogoSVG = ({ size = 90 }) => (
<img
src="https://i.ibb.co/B2MQC3ff/Gemini-Generated-Image-hjym2mhjym2mhjym.png"
alt="Al Nile Gourmet Logo"
style={{
width: size,
height: size,
objectFit: "contain",
borderRadius: "50%",
display: "block"
}}
/>
);

// ─── HOOK ─────────────────────────────────────────────────────────────
function useToast() {
const [toast, setToast] = useState(null);
const timerRef = useRef(null);

const show = useCallback((msg, type = "ok") => {
if (timerRef.current) clearTimeout(timerRef.current);
setToast({ msg, type, key: Date.now() });
timerRef.current = setTimeout(() => setToast(null), 2500);
}, []);

useEffect(() => {
return () => { if (timerRef.current) clearTimeout(timerRef.current); };
}, []);

return [toast, show];
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────
function SafeImg({ src, alt, style, onClick }) {
const [err, setErr]         = useState(false);
const [prevSrc, setPrevSrc] = useState(src);

if (src !== prevSrc) {
setPrevSrc(src);
setErr(false);
}
return (
<img
src={!src || err ? FALLBACK_IMG : src}
alt={alt}
style={style}
onClick={onClick}
onError={() => setErr(true)}
loading="lazy"
/>
);
}

function ReviewCard({ review }) {
return (
<div className="review-card">
<div className="rev-header">
<div className="rev-avatar">{review.avatar}</div>
<div>
<div className="rev-name">{review.name}</div>
<div className="rev-date">{review.date}</div>
</div>
<div className="rev-stars">
{[1,2,3,4,5].map(s => <IconStar key={s} filled={s <= review.rating} size={13} />)}
</div>
</div>
<p className="rev-text">{review.text}</p>
</div>
);
}

function FoodCard({ item, onAdd, onView, idx }) {
return (
<div className="fc" style={{ animationDelay: `${idx * 0.04}s` }}>
<div className="fc-img" onClick={onView} style={{ cursor: "pointer", position: "relative" }}>
<SafeImg src={item.img} alt={item.name} style={{ height: "100%", width: "100%", objectFit: "cover" }} />
{!item.available && <div className="unavail-badge">غير متاح</div>}
</div>
<div className="fc-body">
<h3 className="fc-name" onClick={onView}>{item.name}</h3>
<p className="fc-en">{item.nameEn}</p>
<div className="fc-foot">
<span className="fc-price">{item.price} <small>د.إ</small></span>
<button className="btn-add" disabled={!item.available} onClick={onAdd} aria-label={`أضف ${item.name}`}>
<IconPlus size={13} /> أضف
</button>
</div>
</div>
</div>
);
}

function WideCard({ item, onAdd, onView }) {
return (
<div className="fc-wide">
<div className="fc-wide-inner">
<div className="fc-wide-img" onClick={onView} style={{ cursor: "pointer", position: "relative" }}>
<SafeImg src={item.img} alt={item.name} style={{ height: "100%", width: "100%", objectFit: "cover" }} />
{!item.available && <div className="unavail-badge">غير متاح</div>}
</div>
<div className="fc-wide-body">
<h3 className="fc-wide-name" onClick={onView}>{item.name}</h3>
<p className="fc-wide-en">{item.nameEn}</p>
<div className="variants">
<div className="vrow">
<span className="vlbl">أساسي</span>
<button className="vbtn" disabled={!item.available} onClick={() => onAdd(item.price, null)}>
أضف ({item.priceStr})
</button>
</div>
{item.variants?.map((v, i) => (
<div key={i} className="vrow">
<span className="vlbl">{v.l}</span>
<button className="vbtn" disabled={!item.available} onClick={() => onAdd(parsePrice(v.v), v.l)}>
أضف ({v.v})
</button>
</div>
))}
</div>
</div>
</div>
</div>
);
}

// ─── SCREEN COMPONENTS ────────────────────────────────────────────────
function HomeScreen({ allItems, cats, reviews, go, addToCart, openDetail, handleSecretTap, shopType, switchShopType, activeCat, setActiveCat, search, setSearch }) {
// FIX: shopStatus ديناميكي يتحدث كل دقيقة
const [shopStatus, setShopStatus] = useState(getShopStatus());
useEffect(() => {
const timer = setInterval(() => setShopStatus(getShopStatus()), 60000);
return () => clearInterval(timer);
}, []);

// FIX: الصفحة تبدأ بالمطعم وليس الملحمة للزوار الجدد
const popular = allItems.filter(it => it.type === shopType && it.available).slice(0, 6);

return (
<div>
<div className="hero">
<SafeImg src={I[42]} alt="النيل جورمية" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
<div className="hero-ov" />
<div className="hero-cnt">
<div className="logo-ring" onClick={handleSecretTap} style={{ cursor: "default" }}>
<LogoSVG size={88} />
</div>
<h1 className="hero-name">النيل جورمية</h1>
<p className="hero-sub">هتدوق طعم مصر 🔥</p>
<div className="hero-pills">
<span className="hpill">📍 دبي - أرجان</span>
<span className="hpill">⏱ ٣٠-٤٥ دقيقة</span>
<span className="hpill">⭐ ٤.٩</span>
{/* FIX: حالة المحل ديناميكية */}
<span className={`hpill ${shopStatus.open ? "hpill-open" : "hpill-closed"}`}>
{shopStatus.label}
</span>
</div>
</div>
</div>
<div className="srch">
<div className="srch-box">
<IconSearch />
<input
placeholder="ابحث عن وجبتك أو قطعتك…"
value={search}
onChange={e => setSearch(e.target.value)}
onFocus={() => go("menu")}
aria-label="بحث"
/>
{search && <button className="srch-clear" onClick={() => setSearch("")}>×</button>}
</div>
</div>
<div className="type-tabs">
{[["butcher","🥩","الملحمة"],["restaurant","🍽️","المطعم"]].map(([t,ic,l]) => (
<button key={t} className={`ttab ${shopType===t?"on":""}`} onClick={() => switchShopType(t)}>
<span style={{ fontSize: 18 }}>{ic}</span>{l}
</button>
))}
</div>
<div className="cscr">
{cats.map(c => (
<button key={c.id} className={`cc ${activeCat===c.id?"on":""}`}
onClick={() => { setActiveCat(c.id); go("menu"); }}>
{c.name.split(" ")[0]}
</button>
))}
</div>
<div className="wa-banner"
onClick={() => window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("مرحباً، أريد الطلب من النيل جورمية 🌿")}`, "_blank")}
role="button" aria-label="اطلب عبر واتساب">
<IconWa size={26} />
<div className="wa-txt"><h4>اطلب عبر واتساب</h4><p>تواصل معنا مباشرة الآن</p></div>
<span style={{ marginRight: "auto", color: "rgba(255,255,255,.6)", fontSize: 20 }}>›</span>
</div>
<div className="platforms">
<p className="plat-title">اطلب عبر تطبيقات التوصيل</p>
<div className="plat-row">
<a className="plat-btn" href={SOCIAL.talabat}   target="_blank" rel="noreferrer"><span>🛵</span>طلبات</a>
<a className="plat-btn" href={SOCIAL.deliveroo} target="_blank" rel="noreferrer"><span>🟦</span>ديليفرو</a>
<a className="plat-btn" href={SOCIAL.noon}      target="_blank" rel="noreferrer"><span>🟡</span>نون فود</a>
</div>
</div>
<div className="sec-hd">
<h2 className="sec-title">🔥 الأكثر طلباً</h2>
<button className="see-all" onClick={() => go("menu")}>عرض الكل ›</button>
</div>
<div className="grid">
{popular.map((item, i) => (
<FoodCard key={item.id} item={item} onAdd={() => addToCart(item)} onView={() => openDetail(item)} idx={i} />
))}
</div>
<div className="promo">
<div><h3>توصيل مجاني</h3><p>على الطلبات فوق ١٥٠ درهم</p></div>
<span style={{ fontSize: 34 }}>🚀</span>
</div>
<div className="sec-hd" style={{ paddingTop: 6 }}>
<h2 className="sec-title">⭐ آراء العملاء</h2>
<button className="see-all" onClick={() => go("about")}>عرض الكل ›</button>
</div>
{reviews.slice(0, 2).map((r, i) => <ReviewCard key={i} review={r} />)}
<div style={{ height: 20 }} />
</div>
);
}

function MenuScreen({ items, cats, shopType, switchShopType, activeCat, setActiveCat, search, setSearch, addToCart, openDetail }) {
return (
<div>
<div className="sth">
<h1 className="sth-title">القائمة</h1>
<span style={{ fontSize: 12, color: "var(–g)", fontWeight: 800, background: "var(–sf1)", padding: "4px 10px", borderRadius: 20, border: "1px solid var(–bd)" }}>
{items.length} عنصر
</span>
</div>
<div style={{ padding: "0 15px" }}>
<div className="type-tabs" style={{ margin: 0, padding: 0 }}>
{[["butcher","🥩","الملحمة"],["restaurant","🍽️","المطعم"]].map(([t,ic,l]) => (
<button key={t} className={`ttab ${shopType===t?"on":""}`} onClick={() => switchShopType(t)}>
<span style={{ fontSize: 16 }}>{ic}</span>{l}
</button>
))}
</div>
</div>
<div className="cscr" style={{ paddingTop: 12 }}>
<button className={`cc ${activeCat==="all"?"on":""}`} onClick={() => setActiveCat("all")}>الكل</button>
{cats.map(c => (
<button key={c.id} className={`cc ${activeCat===c.id?"on":""}`} onClick={() => setActiveCat(c.id)}>{c.name}</button>
))}
</div>
<div className="srch" style={{ paddingTop: 0 }}>
<div className="srch-box">
<IconSearch />
<input placeholder="ابحث في القائمة…" value={search} onChange={e => setSearch(e.target.value)} aria-label="بحث" />
{search && <button className="srch-clear" onClick={() => setSearch("")}>×</button>}
</div>
</div>
<div className="rcount">
<span>{items.length} عنصر</span>
<span className="rccat">{activeCat === "all" ? "الكل" : cats.find(c => c.id === activeCat)?.name || ""}</span>
</div>
<div className="grid" style={{ paddingBottom: 24 }}>
{items.map((item, i) =>
item.variants
? <WideCard key={item.id} item={item} onAdd={(p, lbl) => addToCart(item, p, lbl)} onView={() => openDetail(item)} />
: <FoodCard key={item.id} item={item} onAdd={() => addToCart(item)} onView={() => openDetail(item)} idx={i} />
)}
{items.length === 0 && (
<div style={{ gridColumn: "span 2", textAlign: "center", padding: "40px 0", color: "var(–t3)" }}>
<div style={{ fontSize: 42, marginBottom: 12 }}>🔍</div>
<p>لا توجد نتائج مطابقة</p>
{search && <button onClick={() => setSearch("")} style={{ marginTop: 12, color: "var(–g)", fontWeight: 800, fontSize: 13 }}>مسح البحث</button>}
</div>
)}
</div>
</div>
);
}

function DetailScreen({ detailItem, detailQty, setDetailQty, prevPage, allItems, allCats, addToCart, go, setDetailItem, scrollRef }) {
if (!detailItem) return null;
const it  = detailItem;
const cat = allCats.find(c => c.id === it.cid);
return (
<div>
<div className="det-hero">
<SafeImg src={it.img} alt={it.name} style={{ height: "100%", width: "100%", objectFit: "cover" }} />
<div className="det-ov" />
<button className="det-back" onClick={() => go(prevPage)} aria-label="رجوع"><IconBack /></button>
{!it.available && (
<div style={{ position: "absolute", top: 14, left: 14, background: "rgba(239,68,68,.9)", color: "#fff", fontSize: 11, fontWeight: 900, padding: "5px 11px", borderRadius: 9 }}>
غير متاح
</div>
)}
</div>
<div className="det-cnt">
<div className="det-top">
<div>
<span className="det-cat">{cat?.name || ""}</span>
<h1 className="det-name">{it.name}</h1>
</div>
<div className="det-price">{it.price}<small> د.إ</small></div>
</div>
<p className="det-en">{it.nameEn}</p>
{it.variants ? (
<div className="var-sec">
<div className="var-hd">اختر الحجم</div>
<div className="var-row">
<span className="var-lbl">الأساسي</span>
<span className="var-price">{it.priceStr}</span>
<button className="var-addbtn" onClick={() => { addToCart(it); go(prevPage); }}>+ أضف</button>
</div>
{it.variants.map((v, i) => (
<div key={i} className="var-row">
<span className="var-lbl">{v.l}</span>
<span className="var-price">{v.v}</span>
<button className="var-addbtn" onClick={() => { addToCart(it, parsePrice(v.v), v.l); go(prevPage); }}>+ أضف</button>
</div>
))}
</div>
) : (
<>
<div className="qty-row">
<span style={{ fontSize: 14.5, fontWeight: 800 }}>الكمية</span>
<div className="qty-ctrl">
<button className="qbtn" onClick={() => setDetailQty(q => Math.max(1, q - 1))} aria-label="تقليل"><IconMinus /></button>
<span className="qval">{detailQty}</span>
<button className="qbtn" onClick={() => setDetailQty(q => q + 1)} aria-label="زيادة"><IconPlus /></button>
</div>
</div>
<button className="btn-addlg" disabled={!it.available}
onClick={() => { for (let i = 0; i < detailQty; i++) addToCart(it); go(prevPage); }}>
<IconCart size={20} />
{it.available ? `أضف للسلة — ${(it.price * detailQty).toFixed(0)} د.إ` : "غير متاح حالياً"}
</button>
</>
)}
<h3 style={{ fontSize: 15.5, fontWeight: 900, marginBottom: 11 }}>منتجات مشابهة</h3>
<div className="grid" style={{ padding: 0 }}>
{allItems.filter(r => r.cid === it.cid && r.id !== it.id).slice(0, 4).map((r, i) => (
<FoodCard key={r.id} item={r} onAdd={() => addToCart(r)}
onView={() => { setDetailItem(r); setDetailQty(1); scrollRef.current?.scrollTo({ top: 0, behavior: "instant" }); }}
idx={i} />
))}
</div>
<div style={{ height: 20 }} />
</div>
</div>
);
}

function CartScreen({ cart, cartTotal, updateQty, setCart, setCheckoutOpen, go }) {
const del   = cartTotal >= 150 ? 0 : 15;
const grand = cartTotal + del;
if (cart.length === 0) return (
<div>
<div className="sth"><h1 className="sth-title">سلة الطلبات</h1></div>
<div className="empty-pg">
<div className="empty-ico">🛒</div>
<h2>السلة فارغة</h2>
<p>أضف وجباتك أو قطعتك المفضلة</p>
<button className="btn-pri" onClick={() => go("menu")}>تصفح القائمة</button>
</div>
</div>
);
return (
<div>
<div className="sth">
<h1 className="sth-title">سلة الطلبات</h1>
<span style={{ background: "var(–sf1)", border: "1px solid var(–bd)", borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 800, color: "var(–g)" }}>
{cart.length} عنصر
</span>
</div>
<div className="clist">
{cart.map(c => (
<div key={c.id} className="ci">
<SafeImg src={c.item.img} alt={c.item.name} style={{ width: 68, height: 68, borderRadius: 11, objectFit: "cover", flexShrink: 0 }} />
<div className="ci-info">
<p className="ci-name">{c.item.name}</p>
{c.varLabel && <p className="ci-sub">{c.varLabel}</p>}
<p className="ci-p">{c.price} د.إ / الوحدة</p>
<div className="qty-sm">
<button className="qbsm" onClick={() => updateQty(c.id, -1)} aria-label="تقليل"><IconMinus size={12} /></button>
<span style={{ fontSize: 13, fontWeight: 900, minWidth: 18, textAlign: "center" }}>{c.qty}</span>
<button className="qbsm" onClick={() => updateQty(c.id, 1)} aria-label="زيادة"><IconPlus size={12} /></button>
</div>
</div>
<div className="ci-r">
<button className="rmbtn" onClick={() => setCart(prev => prev.filter(x => x.id !== c.id))} aria-label="إزالة">🗑</button>
<span className="ci-tot">{(c.price * c.qty).toFixed(0)} د.إ</span>
</div>
</div>
))}
</div>
<div className="summary">
<div className="srow"><span>المجموع</span><span>{cartTotal.toFixed(0)} د.إ</span></div>
<div className="srow">
<span>التوصيل</span>
<span className={del === 0 ? "free" : ""}>{del === 0 ? "مجاناً 🎉" : `${del} د.إ`}</span>
</div>
{del > 0 && <p className="hint">أضف {(150 - cartTotal).toFixed(0)} د.إ للتوصيل المجاني</p>}
<div className="sdiv" />
<div className="srow stotal"><span>الإجمالي</span><span>{grand.toFixed(0)} د.إ</span></div>
</div>
<div className="chk-bar">
<button className="btn-chk" onClick={() => setCheckoutOpen(true)}>
🛍 إتمام الطلب — {grand.toFixed(0)} د.إ
</button>
</div>
<div style={{ height: 20 }} />
</div>
);
}

function OrdersScreen({ orders, go, setTrackId }) {
const statMap = {
confirmed: { l: "تم التأكيد",    bg: "rgba(34,197,94,.12)",  c: "#22C55E" },
preparing: { l: "قيد التحضير",   bg: "rgba(99,102,241,.12)", c: "#818CF8" },
ready:     { l: "جاهز للتوصيل", bg: "rgba(14,165,233,.12)", c: "#38BDF8" },
delivered: { l: "تم التوصيل",    bg: "rgba(34,197,94,.12)",  c: "#22C55E" },
};
if (orders.length === 0) return (
<div>
<div className="sth"><h1 className="sth-title">طلباتي</h1></div>
<div className="empty-pg">
<div className="empty-ico">📋</div>
<h2>لا توجد طلبات</h2>
<p>ابدأ طلبك الأول الآن</p>
<button className="btn-pri" onClick={() => go("menu")}>تصفح القائمة</button>
</div>
</div>
);
return (
<div>
<div className="sth"><h1 className="sth-title">طلباتي</h1></div>
<div className="olist">
{orders.map(o => {
const st = statMap[o.status] || statMap.confirmed;
const d  = new Date(o.date);
return (
<div key={o.id} className="ocard" onClick={() => { setTrackId(o.id); go("track"); }}>
<div className="ocard-top">
<div>
<p className="oid">{o.id}</p>
<p className="odate">{d.toLocaleDateString("ar-AE")} — {d.toLocaleTimeString("ar-AE", { hour: "2-digit", minute: "2-digit" })}</p>
</div>
<div className="ostatus" style={{ background: st.bg, color: st.c }}>{st.l}</div>
</div>
<div className="thumbrow">
{o.items.slice(0, 3).map((c, i) => (
<SafeImg key={i} src={c.item.img} alt={c.item.name} style={{ width: 42, height: 42, borderRadius: 9, objectFit: "cover", border: "2px solid var(–bdl)" }} />
))}
{o.items.length > 3 && <div className="omoreimg">+{o.items.length - 3}</div>}
</div>
<div className="ofoot">
<span>{o.items.length} عنصر</span>
<span className="ototl">{o.total} د.إ</span>
<span>›</span>
</div>
</div>
);
})}
</div>
<div style={{ height: 20 }} />
</div>
);
}

function TrackScreen({ orders, trackId, go }) {
const order = orders.find(o => o.id === trackId);
if (!order) return (
<div className="empty-pg">
<div className="empty-ico">🔍</div>
<h2>الطلب غير موجود</h2>
<button className="btn-pri" onClick={() => go("orders")}>طلباتي</button>
</div>
);
const STEPS = [
{ k: "pending",   l: "تم استلام الطلب", ic: "📱" },
{ k: "confirmed", l: "تم تأكيد الطلب",  ic: "✅" },
{ k: "preparing", l: "قيد التحضير",      ic: "👨‍🍳" },
{ k: "ready",     l: "خرج للتوصيل",      ic: "🛵" },
{ k: "delivered", l: "تم التوصيل",        ic: "🎉" },
];
const si = STEPS.findIndex(s => s.k === order.status);
return (
<div>
<div className="sth">
<button style={{ display: "flex", alignItems: "center", color: "var(–t1)" }} onClick={() => go("orders")} aria-label="رجوع"><IconBack /></button>
<h1 className="sth-title">تتبع الطلب</h1>
<div style={{ width: 28 }} />
</div>
<div className="mapph">
<div style={{ textAlign: "center", zIndex: 1 }}>
<div className="mappin">📍</div>
<p style={{ fontSize: 12.5, color: "var(–t3)", marginTop: 7 }}>دبي - أرجان</p>
</div>
</div>
<div className="tcard">
<div className="thd">
<div>
<p style={{ fontSize: 13.5, fontWeight: 900 }}>{order.id}</p>
<p style={{ fontSize: 11.5, color: "var(–t3)", marginTop: 3 }}>⏱ الوقت المتوقع: ٣٠-٤٥ دقيقة</p>
</div>
<p style={{ fontSize: 17.5, fontWeight: 900, color: "var(–g)" }}>{order.total} د.إ</p>
</div>
<div className="steps">
{STEPS.map((s, i) => {
const done = i <= si, curr = i === si;
return (
<div key={s.k} className={`step ${done?"done":""} ${curr?"curr":""}`}>
<div className="step-ic">
<div className="sdot">{done ? s.ic : "○"}</div>
{i < STEPS.length - 1 && <div className={`sline ${i < si ? "done" : ""}`} />}
</div>
<p className="slbl">{s.l}</p>
</div>
);
})}
</div>
<div className="taddr">📍 <span>{order.addr}</span></div>
<div className="titems">
{order.items.map((c, i) => (
<div key={i} className="titem">
<SafeImg src={c.item.img} alt={c.item.name} style={{ width: 38, height: 38, borderRadius: 7, objectFit: "cover" }} />
<span>{c.item.name}</span>
<span style={{ marginRight: "auto", color: "var(–t3)" }}>×{c.qty}</span>
</div>
))}
</div>
<a href={`tel:+${WA_NUMBER}`} className="btn-call">📞 اتصل بالمطعم</a>
</div>
<div style={{ height: 20 }} />
</div>
);
}

function AboutScreen({ reviews, setReviews, showReviewForm, setShowReviewForm, newReview, setNewReview, showToast, isAdmin, setShowAdminLogin, go }) {
return (
<div>
<div className="sth"><h1 className="sth-title">عن المطعم</h1></div>
<div className="info-section">
<div className="info-row">
<div className="info-ico">📍</div>
<div className="info-text"><div className="info-label">العنوان</div><div className="info-val" style={{ fontSize: 12 }}>{ADDRESS}</div></div>
</div>
<div className="info-row clickable" style={{ cursor: "pointer" }} onClick={() => window.open(`tel:+${WA_NUMBER}`)}>
<div className="info-ico">📞</div>
<div className="info-text"><div className="info-label">اتصل بنا</div><div className="info-val">{PHONE_NUMBER}</div></div>
<span style={{ color: "var(–g)" }}>›</span>
</div>
<div className="info-row clickable" style={{ cursor: "pointer" }}
onClick={() => window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("مرحباً أريد الاستفسار")}`, "_blank")}>
<div className="info-ico"><IconWa size={20} /></div>
<div className="info-text"><div className="info-label">واتساب</div><div className="info-val">{PHONE_NUMBER}</div></div>
<span style={{ color: "var(–wa)" }}>›</span>
</div>
<div className="info-row">
<div className="info-ico">🕐</div>
<div className="info-text"><div className="info-label">ساعات العمل</div><div className="info-val">يومياً ١١ ص – ١١ م</div></div>
</div>
</div>
<div className="info-section" style={{ margin: "10px 15px 14px" }}>
<div style={{ padding: "12px 15px 8px", borderBottom: "1px solid var(–bdl)" }}>
<p style={{ fontSize: 13, fontWeight: 800, color: "var(–t2)" }}>تابعنا على السوشيال ميديا</p>
</div>
<div className="social-row">
<a className="soc-btn" href={SOCIAL.facebook}  target="_blank" rel="noreferrer"><IconFacebook />فيسبوك</a>
<a className="soc-btn" href={SOCIAL.instagram} target="_blank" rel="noreferrer"><IconInstagram />انستاجرام</a>
<a className="soc-btn" href={SOCIAL.tiktok}    target="_blank" rel="noreferrer"><IconTikTok />تيك توك</a>
</div>
</div>
<div className="platforms">
<p className="plat-title">اطلب عبر تطبيقات التوصيل</p>
<div className="plat-row">
<a className="plat-btn" href={SOCIAL.talabat}   target="_blank" rel="noreferrer">🛵 طلبات</a>
<a className="plat-btn" href={SOCIAL.deliveroo} target="_blank" rel="noreferrer">🚲 ديليفرو</a>
<a className="plat-btn" href={SOCIAL.noon}      target="_blank" rel="noreferrer">🟡 نون فود</a>
</div>
</div>
<div className="sec-hd">
<h2 className="sec-title">⭐ آراء العملاء</h2>
<div style={{ display: "flex", alignItems: "center", gap: 4 }}>
{[1,2,3,4,5].map(s => <IconStar key={s} filled size={13}/>)}
<span style={{ fontSize: 12, fontWeight: 800, color: "var(–g)", marginRight: 4 }}>4.9</span>
</div>
</div>
{reviews.map((r, i) => <ReviewCard key={i} review={r} />)}
{!showReviewForm ? (
<button className="add-review-btn" onClick={() => setShowReviewForm(true)}>+ أضف تقييمك</button>
) : (
<div className="review-form">
<p style={{ fontSize: 14, fontWeight: 900, marginBottom: 12 }}>أضف تقييمك 🌟</p>
<div className="star-select">
{[1,2,3,4,5].map(s => (
<button key={s} className="star-btn" onClick={() => setNewReview(r => ({ …r, rating: s }))}>
{s <= newReview.rating ? "⭐" : "☆"}
</button>
))}
</div>
<input className="form-input" placeholder="اسمك" value={newReview.name}
onChange={e => setNewReview(r => ({ …r, name: e.target.value }))}
style={{ marginBottom: 10, display: "block", width: "100%" }} />
<textarea className="form-input" style={{ resize: "none", height: 80, display: "block", marginBottom: 12, width: "100%" }}
placeholder="شاركنا تجربتك…" value={newReview.text}
onChange={e => setNewReview(r => ({ …r, text: e.target.value }))} />
<button className="btn-save" onClick={() => {
if (!newReview.name.trim() || !newReview.text.trim()) { showToast("أكمل البيانات", "err"); return; }
setReviews(prev => [{ name: newReview.name.trim(), rating: newReview.rating, text: newReview.text.trim(), date: "الآن", avatar: newReview.name[0] }, …prev]);
setNewReview({ name: "", text: "", rating: 5 });
setShowReviewForm(false);
showToast("✓ شكراً على تقييمك!");
}}>إرسال التقييم</button>
<button className="btn-cancel" onClick={() => setShowReviewForm(false)}>إلغاء</button>
</div>
)}
{!isAdmin && (
<button className="admin-access-btn" onClick={() => setShowAdminLogin(true)}>
<span style={{ fontSize: 18 }}>⚙️</span>
<div>
<div style={{ fontSize: 13, fontWeight: 900, color: "var(–t2)" }}>لوحة تحكم المطعم</div>
<div style={{ fontSize: 11, color: "var(–t3)", marginTop: 2 }}>للمسؤولين فقط</div>
</div>
<span style={{ marginRight: "auto", color: "var(–t3)" }}>›</span>
</button>
)}
{isAdmin && (
<button className="admin-access-btn" onClick={() => go("admin")} style={{ borderColor: "rgba(201,162,39,.4)", color: "var(–g)" }}>
<span style={{ fontSize: 18 }}>⚙️</span>
<div style={{ fontSize: 13, fontWeight: 900 }}>فتح لوحة التحكم</div>
<span style={{ marginRight: "auto" }}>›</span>
</button>
)}
<div style={{ height: 20 }} />
</div>
);
}

function AdminScreen({ allItems, allCats, adminItems, toggleAvailable, setEditingItem, go, setIsAdmin }) {
const availCount   = Object.values(adminItems).filter(v => v.available).length;
const unavailCount = Object.values(adminItems).length - availCount;
const grouped = allCats.map(cat => ({ cat, items: allItems.filter(it => it.cid === cat.id) })).filter(g => g.items.length > 0);
return (
<div>
<div className="admin-header">
<div>
<p className="admin-title">⚙️ لوحة التحكم</p>
<p className="admin-subtitle">إدارة المنتجات والأسعار والصور</p>
</div>
<button className="admin-logout-btn" onClick={() => { setIsAdmin(false); go("home"); }}>خروج 🔓</button>
</div>
<div className="admin-stats">
<div className="astat"><div className="astat-val">{allItems.length}</div><div className="astat-label">منتج</div></div>
<div className="astat"><div className="astat-val" style={{ color: "var(–grn)" }}>{availCount}</div><div className="astat-label">متاح</div></div>
<div className="astat"><div className="astat-val" style={{ color: "var(–red)" }}>{unavailCount}</div><div className="astat-label">غير متاح</div></div>
</div>
{grouped.map(({ cat, items }) => (
<div key={cat.id} className="admin-card">
<div className="admin-cat-header"><span className="admin-cat-name">{cat.name} · {cat.nameEn}</span></div>
{items.map(item => {
const ov      = adminItems[item.id];
const isAvail = ov?.available ?? true;
return (
<div key={item.id} className="admin-item">
<SafeImg src={item.img} alt={item.name} style={{ width: 52, height: 52, borderRadius: 10, objectFit: "cover", flexShrink: 0, opacity: isAvail ? 1 : .45 }} />
<div className="admin-item-info">
<div className="admin-item-name" style={{ color: isAvail ? "var(–t1)" : "var(–t3)" }}>{item.name}</div>
<div className="admin-item-price">{item.priceStr}</div>
</div>
<div className="admin-item-actions">
<button className="edit-btn" onClick={() => setEditingItem(item)} aria-label="تعديل"><IconEdit size={14} /></button>
<button className={`tgl ${isAvail?"on":""}`} onClick={() => toggleAvailable(item.id)}
role="switch" aria-checked={isAvail} aria-label={isAvail?"إخفاء":"إظهار"}>
<span className="tglth" />
</button>
</div>
</div>
);
})}
</div>
))}
<div style={{ height: 20 }} />
</div>
);
}

function SuccessScreen({ go }) {
return (
<div className="succ-pg">
<div className="succ-ring"><IconCheck /></div>
<h2>تم إرسال طلبك! 🎉</h2>
<p>تم إرسال طلبك على واتساب النيل جورمية وسيتم التواصل معك قريباً</p>
<button className="btn-pri" onClick={() => go("orders")}>عرض طلباتي</button>
<button onClick={() => go("home")} style={{ color: "var(–g)", fontWeight: 800, fontSize: 14, marginTop: 4 }}>العودة للرئيسية</button>
</div>
);
}

// ─── CHECKOUT SHEET ────────────────────────────────────────────────────
function CheckoutSheet({ cartTotal, onClose, onConfirm, showToast }) {
const [addr,  setAddr]  = useState("دبي - أرجان");
const [name,  setName]  = useState("");
const [phone, setPhone] = useState("");
// FIX: خطأ التحقق من رقم الهاتف
const [phoneErr, setPhoneErr] = useState("");
const del   = cartTotal >= 150 ? 0 : 15;
const grand = cartTotal + del;

const handlePhoneChange = (e) => {
const val = e.target.value;
setPhone(val);
if (val && !validatePhone(val)) {
setPhoneErr("رقم الهاتف غير صحيح (مثال: 0501234567)");
} else {
setPhoneErr("");
}
};

const handleConfirm = () => {
if (!addr.trim()) { showToast("أدخل عنوان التوصيل", "err"); return; }
if (phone && !validatePhone(phone)) { showToast("رقم الهاتف غير صحيح", "err"); return; }
onConfirm(addr, name, phone);
};

return (
<div className="shov" onClick={onClose} role="dialog" aria-modal="true">
<div className="sh" onClick={e => e.stopPropagation()}>
<div className="shndl" />
<h3 className="shtitle">تفاصيل الطلب</h3>
<p className="flbl">👤 اسمك</p>
<input className="finp" value={name} onChange={e => setName(e.target.value)} placeholder="اسمك الكريم…" autoComplete="name" />
<p className="flbl">📱 رقم الموبايل</p>
<input
className={`finp ${phoneErr ? "finp-err" : ""}`}
value={phone}
onChange={handlePhoneChange}
placeholder="+971501234567"
type="tel"
autoComplete="tel"
inputMode="tel"
/>
{/* FIX: رسالة خطأ رقم الهاتف */}
{phoneErr && <p className="field-err">{phoneErr}</p>}
<p className="flbl">📍 عنوان التوصيل <span style={{ color: "var(–red)" }}>*</span></p>
<textarea className="fta" rows={3} value={addr} onChange={e => setAddr(e.target.value)} placeholder="المنطقة، الشارع، رقم المبنى…" />
<div className="chk-sm">
<div className="srow"><span>المجموع</span><span>{cartTotal.toFixed(0)} د.إ</span></div>
<div className="srow"><span>التوصيل</span><span className={del===0?"free":""}>{del===0?"مجاناً 🎉":`${del} د.إ`}</span></div>
<div className="sdiv" />
<div className="srow stotal"><span>الإجمالي</span><span>{grand.toFixed(0)} د.إ</span></div>
</div>
<button className="btn-chk" style={{ marginTop: 14 }} onClick={handleConfirm}>
<IconWa size={18} /> إرسال الطلب على واتساب
</button>
</div>
</div>
);
}

// ─── EDIT ITEM MODAL ───────────────────────────────────────────────────
function EditItemModal({ item, currentData, onSave, onClose }) {
const [priceStr, setPriceStr] = useState(currentData?.priceStr || item.priceStr);
const [imgUrl,   setImgUrl]   = useState(currentData?.img      || item.img);
return (
<div className="edit-modal-ov" onClick={onClose} role="dialog" aria-modal="true">
<div className="edit-modal" onClick={e => e.stopPropagation()}>
<div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
<SafeImg src={imgUrl} alt={item.name} style={{ width: 56, height: 56, borderRadius: 11, objectFit: "cover", border: "1px solid var(–bdl)", flexShrink: 0 }} />
<div>
<h3 style={{ fontSize: 15, fontWeight: 900, margin: 0 }}>{item.name}</h3>
<p style={{ fontSize: 11, color: "var(–t3)", marginTop: 2 }}>{item.nameEn}</p>
</div>
</div>
<div className="form-group">
<label className="form-label">السعر (مثال: 60 درهم)</label>
<input className="form-input" value={priceStr} onChange={e => setPriceStr(e.target.value)} placeholder="60 درهم" />
</div>
<div className="form-group">
<label className="form-label">رابط الصورة (URL)</label>
<input className="form-input" value={imgUrl} onChange={e => setImgUrl(e.target.value)} placeholder="https://…" type="url" inputMode="url" />
</div>
{imgUrl && (
<div style={{ marginBottom: 14 }}>
<label className="form-label">معاينة الصورة</label>
<SafeImg src={imgUrl} alt="preview" style={{ height: 100, borderRadius: 10, objectFit: "cover", border: "1px solid var(–bdl)" }} />
</div>
)}
<button className="btn-save" onClick={() => onSave(item.id, { priceStr, img: imgUrl })}>حفظ التغييرات</button>
<button className="btn-cancel" onClick={onClose}>إلغاء</button>
</div>
</div>
);
}

// ─── ADMIN LOGIN MODAL ────────────────────────────────────────────────
function AdminLoginModal({ onSuccess, onClose }) {
const [pw,  setPw]  = useState("");
const [err, setErr] = useState(false);
// FIX: إضافة حماية بسيطة ضد brute force — قفل بعد 5 محاولات خاطئة
const [attempts, setAttempts] = useState(0);
const [locked,   setLocked]   = useState(false);
const [lockTimer, setLockTimer] = useState(0);

useEffect(() => {
let interval;
if (locked && lockTimer > 0) {
interval = setInterval(() => {
setLockTimer(t => {
if (t <= 1) { setLocked(false); setAttempts(0); return 0; }
return t - 1;
});
}, 1000);
}
return () => clearInterval(interval);
}, [locked, lockTimer]);

const handleLogin = () => {
if (locked) return;
if (pw === ADMIN_PASSWORD) {
onSuccess();
} else {
const newAttempts = attempts + 1;
setAttempts(newAttempts);
setErr(true);
setPw("");
if (newAttempts >= 5) {
setLocked(true);
setLockTimer(30); // قفل 30 ثانية
}
}
};

return (
<div className="admin-login-ov" onClick={onClose} role="dialog" aria-modal="true">
<div className="admin-login-box" onClick={e => e.stopPropagation()}>
<div className="admin-login-logo">🔐</div>
<p className="admin-login-title">لوحة التحكم</p>
<p className="admin-login-sub">أدخل كلمة السر للوصول</p>
{locked ? (
<p className="admin-login-err">🔒 تم قفل الدخول — حاول بعد {lockTimer} ثانية</p>
) : (
<>
<input className="admin-login-inp" type="password" placeholder="••••••••"
value={pw} onChange={e => { setPw(e.target.value); setErr(false); }}
onKeyDown={e => e.key === "Enter" && handleLogin()}
autoFocus autoComplete="current-password" />
{err && <p className="admin-login-err">❌ كلمة السر غير صحيحة {attempts >= 3 && `(${5 - attempts} محاولات متبقية)`}</p>}
<button className="admin-login-btn" onClick={handleLogin}>دخول ←</button>
</>
)}
<button className="btn-cancel" onClick={onClose}>إلغاء</button>
</div>
</div>
);
}

// ─── MAIN APP ─────────────────────────────────────────────────────────
export default function App() {
const [page,           setPage]           = useState("home");
const [prevPage,       setPrevPage]       = useState("home");

// FIX: الموقع يبدأ بالمطعم وليس الملحمة
const [shopType,       setShopType]       = useState("restaurant");
const [activeCat,      setActiveCat]      = useState("all");
const [search,         setSearch]         = useState("");

// FIX: السلة والطلبات محفوظة في localStorage
const [cart,           setCart]           = useState(() => loadFromStorage("nile_cart", []));
const [orders,         setOrders]         = useState(() => loadFromStorage("nile_orders", []));

const [detailItem,     setDetailItem]     = useState(null);
const [detailQty,      setDetailQty]      = useState(1);
const [trackId,        setTrackId]        = useState(null);
const [checkoutOpen,   setCheckoutOpen]   = useState(false);
const [toast,          showToast]         = useToast();

// FIX: تعديلات الأدمن محفوظة في localStorage
const [adminItems,     setAdminItems]     = useState(() => loadFromStorage("nile_admin", INIT_ADMIN));
const [editingItem,    setEditingItem]    = useState(null);
const [isAdmin,        setIsAdmin]        = useState(false);
const [showAdminLogin, setShowAdminLogin] = useState(false);

// FIX: التقييمات محفوظة في localStorage
const [reviews,        setReviews]        = useState(() => loadFromStorage("nile_reviews", INIT_REVIEWS));
const [showReviewForm, setShowReviewForm] = useState(false);
const [newReview,      setNewReview]      = useState({ name: "", text: "", rating: 5 });

const scrollRef     = useRef(null);
const adminTapRef   = useRef(0);
const adminTapTimer = useRef(null);

// FIX: حفظ السلة تلقائياً عند التغيير
useEffect(() => { saveToStorage("nile_cart", cart); }, [cart]);

// FIX: حفظ الطلبات تلقائياً عند التغيير
useEffect(() => { saveToStorage("nile_orders", orders); }, [orders]);

// FIX: حفظ تعديلات الأدمن تلقائياً
useEffect(() => { saveToStorage("nile_admin", adminItems); }, [adminItems]);

// FIX: حفظ التقييمات تلقائياً
useEffect(() => { saveToStorage("nile_reviews", reviews); }, [reviews]);

const handleSecretTap = useCallback(() => {
adminTapRef.current += 1;
if (adminTapTimer.current) clearTimeout(adminTapTimer.current);
if (adminTapRef.current >= 5) { adminTapRef.current = 0; if (!isAdmin) setShowAdminLogin(true); }
adminTapTimer.current = setTimeout(() => { adminTapRef.current = 0; }, 2000);
}, [isAdmin]);

const go = useCallback((p) => {
setPrevPage(page);
setPage(p);
scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
}, [page]);

const switchShopType = useCallback((t) => {
setShopType(t); setActiveCat("all"); setSearch("");
}, []);

const ALL_ITEMS = useMemo(() =>
BASE_ITEMS.map(it => {
const ov = adminItems[it.id];
return ov ? { …it, price: ov.price, priceStr: ov.priceStr, img: ov.img, available: ov.available } : { …it, available: true };
}),
[adminItems]);

const cats = useMemo(() => ALL_CATS.filter(c => c.type === shopType), [shopType]);

const items = useMemo(() =>
ALL_ITEMS.filter(it => {
if (it.type !== shopType) return false;
if (activeCat !== "all" && it.cid !== activeCat) return false;
if (search) {
const q = search.toLowerCase();
return it.name.includes(search) || it.nameEn.toLowerCase().includes(q);
}
return true;
}),
[ALL_ITEMS, shopType, activeCat, search]);

const addToCart = useCallback((item, price, varLabel) => {
if (!item.available) { showToast("هذا الصنف غير متاح حالياً", "err"); return; }
const p   = price ?? item.price;
const cid = varLabel ? `${item.id}_${varLabel}` : item.id;
setCart(prev => {
const ex = prev.find(c => c.id === cid);
if (ex) return prev.map(c => c.id === cid ? { …c, qty: c.qty + 1 } : c);
return […prev, { id: cid, item, qty: 1, price: p, varLabel: varLabel ?? null }];
});
showToast("✓ أضيف للسلة");
}, [showToast]);

const updateQty = useCallback((cid, delta) => {
setCart(prev => prev.map(c => c.id === cid ? { …c, qty: Math.max(0, c.qty + delta) } : c).filter(c => c.qty > 0));
}, []);

const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
const cartCount = cart.reduce((s, c) => s + c.qty, 0);

const sendWhatsAppOrder = useCallback((addr, name, phone) => {
const del     = cartTotal >= 150 ? 0 : 15;
const grand   = cartTotal + del;
const orderId = "ORD-" + Math.random().toString(36).slice(2, 7).toUpperCase();
let msg = `🌿 *طلب جديد - النيل جورمية*\n━━━━━━━━━━━━━━━━━\n🔢 رقم الطلب: *${orderId}*\n\n`;
msg += `👤 الاسم: *${name || "عميل"}*\n`;
if (phone) msg += `📱 الموبايل: *${phone}*\n`;
msg += `📍 العنوان: *${addr}*\n\n📋 *تفاصيل الطلب:*\n━━━━━━━━━━━━━━━━━\n`;
cart.forEach(c => { msg += `• ${c.item.name}${c.varLabel ? ` (${c.varLabel})` : ""} × ${c.qty} = *${(c.price * c.qty).toFixed(0)} د.إ*\n`; });
msg += `━━━━━━━━━━━━━━━━━\n💰 المجموع: *${cartTotal.toFixed(0)} د.إ*\n`;
msg += `🚚 التوصيل: *${del === 0 ? "مجاني 🎉" : del + " د.إ"}*\n✅ الإجمالي: *${grand.toFixed(0)} د.إ*\n`;
msg += `━━━━━━━━━━━━━━━━━\n⏰ وقت الطلب: ${new Date().toLocaleString("ar-AE")}\n`;
window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
setOrders(prev => [{ id: orderId, items: […cart], total: grand, status: "confirmed", date: new Date().toISOString(), addr }, …prev]);
setCart([]);
setCheckoutOpen(false);
go("success");
}, [cart, cartTotal, go]);

const openDetail = useCallback((item) => {
setDetailItem(item); setDetailQty(1); go("detail");
}, [go]);

const toggleAvailable = useCallback((id) => {
setAdminItems(prev => ({
…prev,
[id]: { …prev[id], available: !prev[id].available }
}));
}, []);

const saveItemEdit = useCallback((id, updates) => {
setAdminItems(prev => ({
…prev,
[id]: { …prev[id], priceStr: updates.priceStr, price: parsePrice(updates.priceStr), img: updates.img }
}));
setEditingItem(null);
showToast("✓ تم الحفظ بنجاح");
}, [showToast]);

const navPages  = ["home", "menu", "cart", "orders", "about", "admin"];
const activeNav = navPages.includes(page) ? page : (["detail", "track", "success"].includes(page) ? prevPage : "home");

const shopProps   = { shopType, switchShopType, activeCat, setActiveCat, search, setSearch };
const actionProps = { addToCart, openDetail, go };

return (
<div className="shell" dir="rtl">
<div className="scr" ref={scrollRef} key={page}>
{page === "home"    && <HomeScreen allItems={ALL_ITEMS} cats={cats} reviews={reviews} handleSecretTap={handleSecretTap} {…shopProps} {…actionProps} />}
{page === "menu"    && <MenuScreen items={items} cats={cats} {…shopProps} {…actionProps} />}
{page === "detail"  && <DetailScreen detailItem={detailItem} detailQty={detailQty} setDetailQty={setDetailQty} prevPage={prevPage} allItems={ALL_ITEMS} allCats={ALL_CATS} addToCart={addToCart} go={go} setDetailItem={setDetailItem} scrollRef={scrollRef} />}
{page === "cart"    && <CartScreen cart={cart} cartTotal={cartTotal} updateQty={updateQty} setCart={setCart} setCheckoutOpen={setCheckoutOpen} go={go} />}
{page === "orders"  && <OrdersScreen orders={orders} go={go} setTrackId={setTrackId} />}
{page === "track"   && <TrackScreen orders={orders} trackId={trackId} go={go} />}
{page === "about"   && <AboutScreen reviews={reviews} setReviews={setReviews} showReviewForm={showReviewForm} setShowReviewForm={setShowReviewForm} newReview={newReview} setNewReview={setNewReview} showToast={showToast} go={go} isAdmin={isAdmin} setShowAdminLogin={setShowAdminLogin} />}
{page === "admin"   && (isAdmin
? <AdminScreen allItems={ALL_ITEMS} allCats={ALL_CATS} adminItems={adminItems} toggleAvailable={toggleAvailable} setEditingItem={setEditingItem} go={go} setIsAdmin={setIsAdmin} />
: <HomeScreen allItems={ALL_ITEMS} cats={cats} reviews={reviews} handleSecretTap={handleSecretTap} {…shopProps} {…actionProps} />
)}
{page === "success" && <SuccessScreen go={go} />}
</div>

```
  <nav className="bnav" aria-label="التنقل الرئيسي">
    {[
      { id: "home",   label: "الرئيسية", Icon: IconHome },
      { id: "menu",   label: "القائمة",  Icon: IconMenu },
      { id: "cart",   label: "السلة",    Icon: IconCart,   badge: cartCount },
      { id: "orders", label: "طلباتي",   Icon: IconOrders },
      { id: "about",  label: "معلومات",  Icon: IconInfo },
    ].map((navItem) => {
      const NavIcon = navItem.Icon;
      return (
        <button key={navItem.id} className={`nb ${activeNav===navItem.id?"on":""}`} onClick={() => go(navItem.id)}
          aria-label={navItem.label} aria-current={activeNav===navItem.id ? "page" : undefined}>
          <NavIcon size={20} />
          {(navItem.badge ?? 0) > 0 && <span className="nbdg">{(navItem.badge ?? 0) > 99 ? "99+" : navItem.badge}</span>}
          <span className="nl">{navItem.label}</span>
        </button>
      );
    })}
    {isAdmin && (
      <button className={`nb ${activeNav==="admin"?"on":""}`} onClick={() => go("admin")} aria-label="إدارة">
        <IconAdmin size={20} /><span className="nl">إدارة</span>
      </button>
    )}
  </nav>

  {checkoutOpen  && <CheckoutSheet cartTotal={cartTotal} onClose={() => setCheckoutOpen(false)} onConfirm={sendWhatsAppOrder} showToast={showToast} />}
  {editingItem   && <EditItemModal item={editingItem} currentData={adminItems[editingItem.id]} onSave={saveItemEdit} onClose={() => setEditingItem(null)} />}
  {showAdminLogin && <AdminLoginModal onSuccess={() => { setIsAdmin(true); setShowAdminLogin(false); go("admin"); }} onClose={() => setShowAdminLogin(false)} />}

  {toast && <div key={toast.key} className={`toast ${toast.type}`} role="alert" aria-live="polite">{toast.msg}</div>}
</div>
```

);
}