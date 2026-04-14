# CannaFlow 🌿
מערכת ניהול מתקן קנאביס רפואי עם AI

## פריסה ל-Netlify (5 דקות)

### שלב 1 — GitHub
1. צור חשבון GitHub בחינם: https://github.com
2. לחץ **New repository** → תן שם (לדוגמה: `cannaflow`)
3. העלה את 3 הקבצים:
   - `index.html`
   - `netlify.toml`
   - `netlify/functions/ai.js`

### שלב 2 — Netlify
1. צור חשבון Netlify בחינם: https://netlify.com
2. לחץ **Add new site → Import from Git**
3. בחר את ה-repository שיצרת
4. לחץ **Deploy site** (ברירות המחדל בסדר)

### שלב 3 — API Key
1. ב-Netlify: **Site settings → Environment variables**
2. לחץ **Add a variable**
3. Key: `ANTHROPIC_API_KEY`
4. Value: הכנס את ה-API key שלך מ: https://console.anthropic.com
5. לחץ **Save**
6. **Trigger deploy** → האתר יעלה מחדש עם ה-key

### זהו! 🎉
האתר יהיה זמין בכתובת כמו: `https://your-name.netlify.app`
- עובד מכל מקום — מחשב, טלפון, טאבלט
- ה-API key מוסתר בשרת, לא חשוף בקוד
- חינמי לשימוש רגיל (Netlify free tier)

## קבלת API Key
1. כנס ל: https://console.anthropic.com
2. **API Keys → Create Key**
3. העתק ושמור — מופיע פעם אחת בלבד!

## מבנה הקבצים
```
cannaflow/
├── index.html              ← האפליקציה המלאה
├── netlify.toml            ← הגדרות Netlify
└── netlify/
    └── functions/
        └── ai.js           ← proxy לאנתרופיק (מסתיר את ה-key)
```
