# Guide Architecture — مركز المعرفة

> خريطة كاملة لهيكل مركز المعرفة في منصة البيان
> الإصدار: 1.0 | آخر تحديث: يوليو 2026

---

## Overview

مركز المعرفة (Knowledge Center) هو مجموعة الصفحات الإرشادية والتعليمية التي ترافق المتقدم في رحلته مع مسابقات الجهاز المركزي للتنظيم والإدارة. هذه الصفحات **عامة** (لا تحتاج تسجيل دخول) لكنها ترتبط بالمنصة من خلال الـ CTAs.

### المبادئ الأساسية

1. **المحتوى أولاً**: كل صفحة تُبنى من ملف Markdown في `content/`
2. **مكونات موحدة**: كل الـ Sections تُبنى من مكتبة `components/guide/`
3. **ربط بالمنصة**: كل صفحة تنتهي بـ CTA يربط بالتدريب أو المسابقات
4. **مصادر رسمية**: كل معلومة موثقة بالمصدر
5. **متسقة بصرياً**: نفس الـ Header، Theme، ألوان المنصة

---

## 1. هيكل الأدلة (Sitemap)

```
/guide/
│
├── /guide/journey                    ← رحلة المتقدم (الصفحة الأم)
│   ├── /guide/journey#step-1        ← الإعلان
│   ├── /guide/journey#step-2        ← الشروط
│   ├── /guide/journey#step-3        ← التقديم
│   ├── /guide/journey#step-4        ← متابعة الطلب
│   ├── /guide/journey#step-5        ← القبول
│   ├── /guide/journey#step-6        ← الامتحان (→ /guide/exam-day)
│   ├── /guide/journey#step-7        ← النتيجة (→ /guide/after-results)
│   ├── /guide/journey#step-8        ← التعيين
│   └── /guide/journey#step-9        ← استلام العمل
│
├── /guide/exam-day                   ← دليل يوم الاختبار
├── /guide/exam-format                ← كيف يعمل الامتحان
├── /guide/getting-started            ← كيف تبدأ الاستعداد
├── /guide/after-results              ← بعد إعلان النتيجة
│
├── /faq                              ← الأسئلة الشائعة
│
├── /resources                        ← المصادر الرسمية
└──
```

### صفحات إضافية (مستقبلية — V2)

```
/guide/
├── /guide/how-to-read-announcement   ← كيف تقرأ إعلان الوظيفة
├── /guide/documents-guide            ← دليل المستندات
├── /guide/preparation-plan           ← خطة التحضير للامتحان
├── /guide/interview-tips             ← نصائح المقابلة الشخصية
├── /guide/common-mistakes            ← أخطاء شائعة
│
└── /articles/
    ├── /articles/prepare-in-month    ← استعد خلال شهر
    └── /articles/iq-guide            ← دليل أسئلة IQ
```

---

## 2. العلاقات بين الصفحات

### Navigation Flow

```
                    ┌──────────────┐
                    │   Welcome    │
                    │  (Homepage)  │
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
    ┌──────────────────┐     ┌──────────────────┐
    │  /guide/journey  │     │   /guide/         │
    │  (رحلة المتقدم)  │────▶│  getting-started  │
    └───────┬──────────┘     └──────────────────┘
            │                        │
     ┌──────┼──────┐                │
     ▼      ▼      ▼                ▼
  ┌────┐ ┌────┐ ┌────────┐  ┌──────────────┐
  │يوم │ │كيف │ │بعد     │  │    /faq      │
  │    │ │يعمل│ │النتيجة │  └──────────────┘
  └────┘ └────┘ └────────┘         │
      │      │                    ┌──────────────┐
      └──────┴───────────────────▶│  /resources  │
                                  └──────────────┘
```

### Internal Linking

| من | إلى | أين في الصفحة |
|----|-----|---------------|
| /guide/journey | /guide/exam-day | رابط في خطوة "الامتحان" |
| /guide/journey | /guide/exam-format | رابط في خطوة "الامتحان" |
| /guide/journey | /guide/after-results | رابط في خطوة "النتيجة" |
| /guide/journey | /guide/getting-started | رابط في خطوة "الإعلان" |
| /guide/journey | /faq | نهاية الصفحة — RelatedArticles |
| /guide/exam-day | /guide/exam-format | RelatedArticles |
| /guide/exam-day | /guide/journey | RelatedArticles |
| /guide/exam-format | /guide/exam-day | RelatedArticles |
| /guide/exam-format | /guide/getting-started | RelatedArticles |
| /guide/getting-started | /guide/journey | RelatedArticles |
| /guide/getting-started | /faq | RelatedArticles |
| /guide/after-results | /guide/journey | CTA (ابدأ رحلة جديدة) |
| /faq | جميع صفحات الدليل | حسب السؤال |
| /resources | جميع صفحات الدليل | — |

---

## 3. تحليل Sections لكل صفحة

### /guide/journey — رحلة المتقدم

| الـ Section | العدد | المحتوى |
|-------------|-------|---------|
| Hero | 1 | عنوان + وصف المخطط العام |
| Timeline | 1 | 11 خطوة — كل خطوة تنتقل إلى Anchor في الصفحة |
| Information | 11 | قسم لكل مرحلة (شرح + ماذا تفعل) |
| Tip | 3-4 | نصائح: احفظ رقم التقديم، لا تعتمد على وسائل التواصل... |
| Warning | 1-2 | تحذير: كل إعلان يختلف |
| ComparisonTable | 1 | ما الذي قد يختلف بين المسابقات |
| CTA | 1 | "ابدأ التدريب الآن ←" |
| RelatedArticles | 1 | exam-day, exam-format, getting-started, faq |
| OfficialSources | 1 | جدول المصادر |

### /guide/exam-day — يوم الاختبار

| الـ Section | العدد | المحتوى |
|-------------|-------|---------|
| Hero | 1 | عنوان + وصف |
| Checklist | 1 | قائمة فحص قبل الخروج (5-7 عناصر) |
| Information | 3 | قبل الذهاب ← عند الوصول ← داخل القاعة ← بعد الانتهاء |
| Warning | 1-2 | لا تحضر الهاتف، لا تتأخر |
| Tip | 2-3 | احضر قبل الموعد بساعتين، وزع وقتك |
| FAQ | 5 | أسئلة شائعة عن يوم الامتحان |
| CTA | 1 | "جرّب محاكاة الامتحان" |
| RelatedArticles | 1 | journey, exam-format, faq |
| OfficialSources | 1 | بوابة الوظائف، الجهاز المركزي |

### /guide/exam-format — كيف يعمل الامتحان

| الـ Section | العدد | المحتوى |
|-------------|-------|---------|
| Hero | 1 | عنوان + وصف |
| Information | 6 | المحاور الستة (جدارات، لغات، حاسب، معلومات، تخصص، تربوي) |
| Information | 1 | آلية التصحيح والدرجات |
| Information | 1 | شكل الأسئلة (واجهة الامتحان) |
| Tip | 2-3 | نصائح للاستعداد |
| ComparisonTable | 1 | ما الذي قد يختلف بين المسابقات |
| CTA | 1 | "تدرب على محاكاة مشابهة" |
| RelatedArticles | 1 | exam-day, getting-started, faq |
| OfficialSources | 1 | الجهاز المركزي، اللائحة التنفيذية |

### /guide/getting-started — كيف تبدأ

| الـ Section | العدد | المحتوى |
|-------------|-------|---------|
| Hero | 1 | عنوان + وصف |
| Information | 6 | 6 خطوات عملية (اقرأ ← تأكد ← جهز ← قدم ← تدرب ← راجع) |
| Timeline | 1 | جدول زمني (شهر / أسبوع) |
| Tip | 3 | نصائح للبدء المبكر |
| ComparisonTable | 1 | ما الذي يحدد نجاحك |
| CTA | 1 | "ابدأ التدريب الآن" |
| RelatedArticles | 1 | journey, exam-day, faq |
| OfficialSources | 1 | بوابة الوظائف، الجهاز المركزي |

### /guide/after-results — بعد النتيجة

| الـ Section | العدد | المحتوى |
|-------------|-------|---------|
| Hero | 1 | عنوان + وصف |
| Information | 1 | الاستعلام عن النتيجة |
| Information | 1 | التظلم (الشروط، الخطوات، المدة) |
| Information | 1 | استكمال الإجراءات (فحص طبي، مستندات) |
| Information | 1 | إجراءات التعيين (الترتيب الزمني) |
| Information | 1 | قوائم الانتظار |
| Warning | 1-2 | لا تفوّت مهلة التظلم |
| Tip | 2 | تابع بريدك، جهز ملف المستندات |
| LegalReference | 2-3 | مواد 38، 40، 41 من اللائحة |
| CTA | 1 | "ابدأ التدريب لمسابقة جديدة" |
| RelatedArticles | 1 | journey, faq |
| OfficialSources | 1 | قانون 81، اللائحة 1216 |

### /faq — الأسئلة الشائعة

| الـ Section | العدد | المحتوى |
|-------------|-------|---------|
| Hero | 1 | عنوان + وصف |
| FAQ | 33 | مقسمة إلى 5 مجاميع (تقديم، امتحان، نتيجة، بعد النجاح، عام) |
| CTA | 1 | "هل لديك سؤال آخر؟ ←" |
| OfficialSources | 1 | بوابة الوظائف، الجهاز المركزي |

### /resources — المصادر الرسمية

| الـ Section | العدد | المحتوى |
|-------------|-------|---------|
| Hero | 1 | عنوان + وصف |
| Information | 4 | بوابات رسمية، قوانين، وزارات، قنوات متابعة |
| Checklist | 1 | قائمة مراجعة الروابط |
| CTA | 1 | "ابدأ رحلتك ←" |
| OfficialSources | 1 | مصادر هذا الدليل |

---

## 4. Routing Plan

### Routes — عامة (قبل تسجيل الدخول)

| المسار | الصفحة | Controller Action |
|--------|--------|-------------------|
| `/` | welcome | `welcome` (موجود) |
| `/guide/journey` | guide/journey | جديد — `Inertia::render` |
| `/guide/exam-day` | guide/exam-day | جديد |
| `/guide/exam-format` | guide/exam-format | جديد |
| `/guide/getting-started` | guide/getting-started | جديد |
| `/guide/after-results` | guide/after-results | جديد |
| `/faq` | faq | جديد |
| `/resources` | resources | جديد |

### ملاحظات الـ Routing

- جميع المسارات مضافة في `routes/web.php` (وليست `routes/student.php`)
- لا تحتاج middleware `auth`
- لا تحتاج قاعدة بيانات — صفحات ثابتة
- استخدم `Inertia::render()` مباشرة

---

## 5. قواعد Navigation

### الموقع في الـ Header
- مركز المعرفة يكون **قابلاً للوصول من الصفحة الرئيسية (welcome)** ومن **جميع صفحات الطالب بعد تسجيل الدخول**
- في الـ Header: رابط "مركز المعرفة" أو "الدليل الإرشادي"

### Sidebar داخل صفحات الدليل
- Sidebar صغير (على اليمين في RTL) يظهر عند التصفح
- المحتوى: قائمة مراحل الرحلة مع مؤشر على المرحلة الحالية
- يختفي في الشاشات الصغيرة (Responsive)

### Breadcrumbs
```
الرئيسية ← مركز المعرفة ← رحلة المتقدم
الرئيسية ← مركز المعرفة ← دليل يوم الاختبار
```

---

## 6. خطة التوسع (V2)

| الأولوية | الصفحة | يعتمد على |
|----------|--------|-----------|
| 1 | دليل المستندات (documents-guide) | موارد |
| 2 | كيف تقرأ إعلان الوظيفة (how-to-read) | getting-started |
| 3 | خطة التحضير للامتحان (preparation-plan) | exam-format |
| 4 | أخطاء شائعة (common-mistakes) | faq |
| 5 | مقالات متخصصة (articles/) | كل الأدلة |

---

## 7. الـ Embedded CTAs

كل CTA في مركز المعرفة يربط المستخدم بقسم موجود في المنصة (وليس بصفحة خارجية). هذا هو جدول الربط:

| الصفحة | نص الـ CTA | الوجهة |
|--------|------------|--------|
| /guide/journey | "ابدأ التدريب الآن" | /register أو /login |
| /guide/exam-day | "جرّب محاكاة مشابهة" | student.attempts.create |
| /guide/exam-format | "تدرب على محاكاة مشابهة" | student.attempts.create |
| /guide/getting-started | "ابدأ التدريب الآن" | student.topics.index |
| /guide/after-results | "ابدأ التدريب لمسابقة جديدة" | student.competitions.index |
| /faq | "تصفح المسابقات المتاحة" | student.competitions.index |
| /resources | "ابدأ رحلتك" | /register |

---

*آخر تحديث: يوليو 2026*