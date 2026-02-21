# Platform Architecture & Design Specification

## 1. Overview
A high-retention, offline-first PWA fitness platform designed for long-term engagement using gamification and intelligent training insights.

## 2. Folder Structure
```
src/
├── components/     # UI Components (Dashboard, Logger, Visuals)
├── db/             # IndexedDB Schema & Client (Dexie.js)
├── hooks/          # Custom React Hooks (useWorkout, useBattery)
├── utils/          # Core Engines (Math, Training, Projections)
├── services/       # External Integrations (Sync, Background)
├── data/           # Static Data (Quotes, Exercise DB)
└── App.tsx         # Main Entry
```

## 3. State Management Strategy
- **Transient State:** Zustand for active workout session, UI toggles, and real-time XP calculations.
- **Persistent State:** IndexedDB (via Dexie.js) for local-first storage of workout history, user stats, and battery logs.
- **Synchronization:** Background Sync API for eventual consistency with a cloud backend (future).

## 4. Data Schema (IndexedDB)
- `workouts`: { id, date, exercises: [{ name, sets: [{ weight, reps, rpe, xp }] }], total_xp, notes }
- `user_stats`: { rank, current_xp, streak, last_workout, battery }
- `battery_history`: { date, value, factors: [] }
- `exercises`: { id, name, category, pr_weight, pr_e1rm }

## 5. Mathematical Models

### 5.1 XP Curve Model
$XP_{set} = (Weight \times Reps \times \frac{RPE}{10}) \times Multiplier_{streak} \times Multiplier_{battery}$
- **PR Bonus:** 1.5x XP for the entire set.
- **Decay:** 5% reduction in total XP for every 7 days of inactivity (after a 7-day grace period).

### 5.2 Rank System
| Rank | Threshold (Total XP) | Est. Time |
|------|----------------------|-----------|
| Iron | 0 | Start |
| Bronze | 10,000 | 1 Month |
| Silver | 25,000 | 3 Months |
| Gold | 60,000 | 6 Months |
| Platinum | 150,000 | 1 Year |
| Diamond | 400,000 | 1.5 Years |
| Master | 1,000,000 | 2 Years |
| Grandmaster | 2,500,000 | 2.5 Years |

### 5.3 Body Battery 2.0 Formula
$Battery_{t} = \max(0, \min(100, Battery_{t-1} + Recovery - Fatigue))$
- **Recovery:** Base 20% + (Streak $\times$ 2%, max 10%) + (Sleep Score $\times$ 0.5).
- **Fatigue:** $\sum (Sets \times \frac{RPE}{10}) \times 0.1$.

### 5.4 Trend Projection Formula
**Linear Regression on E1RM:**
$E1RM = Weight \times (1 + \frac{Reps}{30})$
$y = mx + b$
- $m = \frac{n\sum(xy) - \sum x\sum y}{n\sum(x^2) - (\sum x)^2}$
- Data threshold: Minimum 5 data points over 14 days before projecting 30-day trend.

## 6. Scalability Plan
- **Horizontal Scaling:** Stateless frontend on Vercel/Netlify.
- **Data Locality:** Heavy use of IndexedDB reduces server load; cloud sync is throttled.
- **Future:** Move projection math to Web Workers for complex multi-lift regression.

## 7. Monetization Options
- **Pro Tier:** Detailed PPL imbalance analytics, advanced 1-year projections, custom haptic profiles.
- **Social:** Community challenges and "Clubs" (subscription-based).
- **Marketplace:** Integrated equipment discounts for high-rank users (Iron → Grandmaster perks).
