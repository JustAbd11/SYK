# 📦 نظام SYK — دليل التشغيل والإعداد

## 🗂️ هيكل المشروع

```
projectSYK/
├── index.html              ← صفحة تسجيل الدخول
├── dashboard.html          ← لوحة التحكم الرئيسية
├── supabase-schema.sql     ← كود قاعدة البيانات (شغّله مرة واحدة)
├── css/
│   └── style.css           ← تصميم كامل النظام
├── js/
│   ├── supabase-config.js  ← إعدادات Supabase (عدّل هذا الملف)
│   └── pdf-generator.js    ← توليد PDF الخطابات
├── logo/
│   └── SYK-LOGO.png        ← ضع اللوقو هنا
└── README.md               ← هذا الملف
```

---

## 🚀 خطوات الإعداد (مرة واحدة فقط)

### 1. إعداد Supabase

1. روح على [supabase.com](https://supabase.com) وأنشئ حساب
2. أنشئ **Project جديد**
3. روح على **SQL Editor** وشغّل محتوى ملف `supabase-schema.sql` كاملاً
4. روح على **Project Settings → API**
5. انسخ:
   - `Project URL` ← يروح في `SUPABASE_URL`
   - `anon public key` ← يروح في `SUPABASE_ANON_KEY`
6. افتح ملف `js/supabase-config.js` وعدّل القيمتين

### 2. إضافة اللوقو

- ضع ملف اللوقو في مجلد `logo/` باسم `SYK-LOGO.png`

### 3. رفع المشروع على GitHub + Vercel

```bash
# في مجلد المشروع
git init
git add .
git commit -m "SYK System v1"
git remote add origin https://github.com/USERNAME/projectSYK.git
git push -u origin main
```

ثم روح [vercel.com](https://vercel.com) → **New Project** → اربطه بـ GitHub Repository → **Deploy**

---

## 🔐 بيانات الدخول

| | |
|---|---|
| **المستخدم** | `Admin` |
| **كلمة المرور** | `Admin32413741391` |

---

## 📄 كيف يشتغل النظام

1. **تسجيل الدخول** → `index.html`
2. **خطاب جديد** → تعبئة الفورم → حفظ → يتنزل `import.pdf` تلقائياً
3. **الخطابات المحفوظة** → عرض، بحث، تعديل، حذف، إعادة تنزيل PDF

---

## 💾 ملف PDF

- يُحفظ تلقائياً باسم `import.pdf` عند الضغط على **حفظ**
- الصفحة الأولى: نص الخطاب الكامل مع الجداول
- الصفحة الثانية: صورة الايصال (إن تم رفعها)

---

## ⚠️ ملاحظات

- النظام يشتغل **بدون Supabase** أيضاً (يحفظ محلياً في المتصفح كـ backup)
- بعد ما تربط Supabase تصير البيانات تُحفظ على السحابة
- الايصالات تُرفع على Supabase Storage تلقائياً
