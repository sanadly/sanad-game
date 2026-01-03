# Terra Nova - Quick Start Guide

## 🚀 What Is This?

**Terra Nova** is a gamified life tracking app that turns your real-world progress into a pixel-art RPG game. You describe your week in natural language, and AI automatically updates your stats and generates quests.

## ⚡ Quick Setup (3 Steps)

1. **Install:**
   ```bash
   npm install
   ```

2. **Add API Key:**
   Create `.env.local`:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
   ```
   Get key from: https://makersuite.google.com/app/apikey

3. **Run:**
   ```bash
   npm run dev
   ```
   Open: http://localhost:3000

## 🎮 How to Play

### Daily/Weekly Check-in
1. Open "The Navigator" chat
2. Type: "I finished my thesis! But I've been eating junk food."
3. Watch stats update automatically
4. Complete quests that appear

### The 6 Stats
- **SOVEREIGNTY** 👑 - Citizenship, legal status
- **CAPITAL** 💰 - Savings, passive income
- **INTELLECT** 👁️ - Learning, deep work
- **AESTHETICS** 🪞 - Fitness, style, travel
- **KINDRED** 🔥 - Relationships, social
- **VITALITY** 🧪 - Sleep, mood, energy

### Key Features
- ✅ **AI Chat**: Natural language input → automatic stat updates
- ✅ **Quests**: AI generates personalized quests
- ✅ **Skill Tree**: 10 levels from Student to Sovereign
- ✅ **Relics**: Unlock achievements
- ✅ **Simulation**: Project your future
- ✅ **Export/Import**: Save your progress

## 📁 Project Structure

```
app/          → Main pages
components/   → UI components
lib/          → Utilities & AI
store/        → Game state
types/        → TypeScript types
public/       → Static assets
```

## 🎯 Main Components

- **StatBar**: Vertical progress bars
- **ChatInterface**: AI conversation
- **QuestList**: Active quests
- **SkillTree**: Progress levels
- **RelicShelf**: Achievements
- **DataManager**: Export/import

## 🔧 Development

```bash
npm run dev    # Development server
npm run build  # Production build
npm run start  # Production server
npm run lint   # Check code
```

## 📚 Full Documentation

See `COMPLETE_GUIDE.md` for:
- Detailed feature descriptions
- Technical architecture
- API integration details
- Developer guide
- Future roadmap

## 🆘 Troubleshooting

**"Gemini API key not found"**
→ Add `NEXT_PUBLIC_GEMINI_API_KEY` to `.env.local`

**Port already in use**
→ Next.js will try 3001, 3002, etc. automatically

**Stats not updating**
→ Check browser console for errors
→ Verify API key is correct

## 💡 Tips

- Be descriptive in chat: "I studied 5 hours" is better than "studied"
- Complete quests to balance stats
- Export your progress regularly
- Check skill tree for next goals

---

**Ready to start your journey to sovereignty?** 🎮

