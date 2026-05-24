# CrysLearn — Founder's Guide

> Written for you, the 15/16-year-old builder behind CrysLearn.
> This is your complete roadmap from "I have code" to "I have a business."

---

## PART 1: UNDERSTANDING YOUR PROJECT

### What is CrysLearn?

CrysLearn is an exam preparation app for Nigerian students. Think of it as the Nigerian version of Khan Academy or Quizlet — but built specifically for JAMB, WAEC, NECO, and Post-UTME.

**In simple terms:** Students pay once, get access to thousands of past questions, take timed mock exams, see explanations for every answer, and track their improvement. Parents can also monitor their children's progress.

### What problem does it solve?

Right now in Nigeria:
- Most exam prep is done with outdated printed booklets
- Online options are clunky, web-only, or too expensive (monthly subscriptions)
- Students in rural areas have no access to quality prep tools
- Parents have no visibility into how their children are preparing

CrysLearn fixes ALL of these. It works on cheap Android phones, works offline, costs a one-time fee, and gives parents a dashboard.

### Your tech stack (what each piece does):

| Technology | What it does | Why we picked it |
|-----------|-------------|------------------|
| Next.js (web) | The website students see | Fast, SEO-friendly, free hosting on Vercel |
| React Native / Expo (mobile) | The Android/iOS app | One codebase = both platforms |
| Supabase | Database + login system | Free tier, handles everything |
| Paystack | Takes payments | Best for Nigeria, supports bank transfer + USSD |
| Tailwind CSS | Makes things look good | Fast to style, consistent design |
| TypeScript | The coding language | Catches bugs before users see them |

---

## PART 2: HOW TO USE YOUR PROJECT

### Step 1: Set up Supabase (your database) — FREE

1. Go to [supabase.com](https://supabase.com) → Sign up with GitHub
2. Click "New Project" → Name it "cryslearn"
3. Choose a strong database password (SAVE THIS)
4. Select region: "West EU" (closest to Nigeria)
5. Once created, go to Settings → API
6. Copy: **Project URL** and **anon/public key** and **service_role key**
7. Go to SQL Editor, run each file in `supabase/migrations/` in order (001 through 006)
8. Then run each file in `supabase/seed/` to add sample questions

### Step 2: Set up Paystack (payments) — FREE to start

1. Go to [paystack.com](https://paystack.com) → Sign up
2. You'll get TEST keys immediately (no verification needed to test)
3. Copy your **test public key** and **test secret key**
4. Later, to accept real money, you'll need:
   - BVN verification
   - A valid bank account (you can use a parent's if needed)

### Step 3: Connect everything (fill .env.local)

In the `web/` folder, copy `.env.example` to `.env.local` and fill in your keys:
```
NEXT_PUBLIC_SUPABASE_URL=https://abc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_SECRET_KEY=sk_test_xxx
```

### Step 4: Run locally

```bash
cd web
npm install
npm run dev
```
Open http://localhost:3000 — you should see the CrysLearn landing page!

### Step 5: Deploy to the internet — FREE

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
3. Click "Import Project" → Select your repo → Select the `web/` folder
4. Add your environment variables in Vercel's settings
5. Click Deploy — your site is now LIVE at `your-project.vercel.app`
6. Later, buy a domain like `cryslearn.ng` or `cryslearn.com.ng` (~₦3,000/year)

### Step 6: Build the mobile app

```bash
cd mobile
npm install
npx expo start
```
Scan the QR code with the Expo Go app on your phone to test.

To publish to Google Play Store:
1. Create a Google Play Developer account ($25 one-time)
2. Run `npx eas build --platform android`
3. Upload the APK/AAB to Play Console

---

## PART 3: WHAT TO USE THE PROJECT FOR

### Revenue Model (How you make money):

| Exam | Price | What student gets |
|------|-------|-------------------|
| JAMB | ₦3,500 | All JAMB past questions + unlimited mocks + AI explanations |
| WAEC | ₦3,500 | All WAEC content |
| NECO | ₦3,500 | All NECO content |
| Post-UTME | ₦5,000 | University-specific screening prep |

**Revenue math (realistic):**
- If 1,000 students pay for JAMB alone = ₦3,500,000 (₦3.5M)
- If 5,000 students across all exams (target: 3 months) = ₦17.5M+
- Paystack takes 1.5% + ₦100 per transaction

### Who pays?
- Parents (60-70%) — they fund education expenses
- Students themselves (20-30%) — using their own savings or pocket money
- Schools (future) — bulk licensing for institutions

---

## PART 4: HOW TO MAINTAIN THE APP

### Weekly tasks:
- [ ] Check if any error reports come in (Supabase logs)
- [ ] Add 10-20 new questions per exam each week
- [ ] Reply to user feedback (WhatsApp, email, or app store reviews)

### Monthly tasks:
- [ ] Review performance metrics in Supabase dashboard
- [ ] Check Paystack for any failed payments
- [ ] Update AI explanations for new questions
- [ ] Post content on social media (TikTok, Instagram, Twitter)

### When something breaks:
1. Check Vercel dashboard for deployment errors
2. Check Supabase logs for database issues
3. Check browser console (F12) for frontend errors
4. Google the error message — Stack Overflow usually has answers

### Adding new questions (most important maintenance task):
Run SQL in Supabase Dashboard → SQL Editor:
```sql
INSERT INTO public.questions (exam_id, subject, year, question_text, options, correct_option, explanation)
VALUES (
  '11111111-1111-1111-1111-111111111111',  -- JAMB ID
  'Mathematics',
  2024,
  'Your question text here',
  '[{"label":"A","text":"Option A"},{"label":"B","text":"Option B"},{"label":"C","text":"Option C"},{"label":"D","text":"Option D"}]',
  'B',
  'Explanation of why B is correct...'
);
```

---

## PART 5: BECOMING A NATIONAL/GLOBAL BRAND

### Phase 1: Local Launch (Months 1-3)

**Goal:** 100-500 paying users

1. Start with YOUR school — get 20 classmates to use it
2. Ask teachers to recommend it (offer them free access)
3. Create a WhatsApp group: "CrysLearn Study Squad"
4. Post on Twitter/X with hashtags: #JAMB2025 #WAEC2025 #CrysLearn
5. Make short TikTok videos: "Watch me score 300+ with this app"

### Phase 2: State Level (Months 3-6)

**Goal:** 1,000-5,000 paying users

1. Partner with tutorial centers (they promote, you give them 20% commission)
2. Run Facebook/Instagram ads targeting parents (₦5,000-₦20,000 budget)
3. Get testimonials from students who scored high
4. Attend education fairs in your state
5. Reach out to education bloggers on Instagram

### Phase 3: National (Months 6-12)

**Goal:** 10,000-50,000 paying users

1. Get featured on tech blogs (TechCabal, Techpoint Africa, BellaNaija)
2. Partner with schools directly — offer school licensing
3. Run radio ads during exam season (JAMB registration period = November-January)
4. Create a referral program: "Invite a friend, get ₦500 off"
5. Apply for startup competitions: Techstars Lagos, Google for Startups Africa

### Phase 4: Pan-African / Global (Year 2+)

1. Add GCE (Ghana), KCSE (Kenya), UNEB (Uganda) exams
2. Add Cambridge and IB curriculum
3. Translate to French for West African francophone countries
4. Apply to Y Combinator or Flat6Labs
5. Raise funding if needed (but try to stay profitable first)

---

## PART 6: BEATING YOUR COMPETITORS

### Your competitors and their weaknesses:

| Competitor | Weakness | How CrysLearn wins |
|-----------|----------|-------------------|
| Prepclass | Expensive subscription (₦5k/month) | One-time payment = no recurring cost |
| JAMB CBT Practice | Web-only, ugly design, no explanations | Beautiful mobile app + AI explanations |
| Past Questions PDFs | No interactivity, no tracking | Timed mocks + progress tracking |
| Testmoz | Generic, not Nigerian-focused | 100% built for Nigerian exams |
| Tutorial centers | Expensive (₦20k-₦100k), location-bound | Accessible anywhere, ₦3,500 only |

### Your unfair advantages:

1. **You ARE your user.** You're a student yourself. You know exactly what's frustrating about existing tools. Use this.
2. **Mobile-first.** Most Nigerian students access the internet only through phones. Your app works perfectly on ₦30,000 Android phones.
3. **One-time pricing.** Nigerian parents hate subscriptions. "Pay once, prep forever" is incredibly attractive.
4. **Offline mode.** In areas with poor network (which is most of Nigeria), your app still works.
5. **Parent dashboard.** No competitor does this. Parents will pay more when they can TRACK results.

### How to stay ahead:

- **Speed:** Ship new features fast. You're one person — that's an advantage (no meetings, no bureaucracy)
- **Content:** Have the MOST questions with the BEST explanations
- **Community:** Build a WhatsApp community of students who help each other
- **Listen:** Every complaint is a feature request. Fix things fast.

---

## PART 7: YOUR TARGET AUDIENCE

### Primary: Students (the users)

- **Age:** 14-19 years old (SS2/SS3)
- **Location:** All 36 states of Nigeria + FCT
- **Phone:** Mostly Android, budget phones (Tecno, Infinix, Samsung A-series)
- **Internet:** Inconsistent. Many use data only when they have airtime
- **Pain:** Anxiety about exams, lack of good study materials, boredom with textbooks
- **Desire:** High scores, admission into top universities, making parents proud

### Secondary: Parents (the payers)

- **Age:** 30-55 years old
- **Income:** Middle class (₦100k-₦500k/month household)
- **Pain:** Can't monitor their child's prep, spending money on ineffective tutoring
- **Desire:** Peace of mind, visible progress, value for money
- **How to reach them:** Facebook, WhatsApp, church/mosque announcements, school PTA meetings

### Where to find them:

- **Online:** Twitter (#JAMB2025), Instagram (education pages), TikTok, Nairaland education forum, WhatsApp groups
- **Offline:** Schools, tutorial centers, bookshops, churches, mosques, community centers
- **Events:** JAMB registration centers (Nov-Jan), education fairs, university open days

---

## PART 8: WHERE TO START (Your First 30 Days)

### Week 1: Launch Preparation

- [ ] Set up Supabase and run all migrations
- [ ] Set up Paystack test account
- [ ] Deploy to Vercel (get a live URL)
- [ ] Add 50+ real questions per exam (use past question booklets)
- [ ] Test the full flow yourself: sign up → pay → take mock → see results

### Week 2: Beta Testing

- [ ] Give access to 5-10 classmates for free
- [ ] Watch them use it — note every confusion point
- [ ] Fix the top 3 issues they report
- [ ] Ask each tester to rate it 1-10 and explain why

### Week 3: Soft Launch

- [ ] Post on your social media: "I built an app for exam prep"
- [ ] Create a simple landing page with a link to download/sign up
- [ ] Offer a "founding member" discount: ₦2,000 instead of ₦3,500
- [ ] Target: 10-20 paying users
- [ ] Set up Paystack LIVE keys (real payments)

### Week 4: Grow

- [ ] Ask every paying user for a testimonial
- [ ] Create 3-5 TikTok/Reels showing the app in action
- [ ] Reach out to 10 tutorial centers about partnership
- [ ] Start adding WAEC/NECO questions too
- [ ] Set a goal: 50 paying users by end of month 2

---

## PART 9: MINDSET ADVICE (From someone who's been there)

### You're 15/16. That's a SUPERPOWER, not a weakness.

- Mark Zuckerberg started Facebook at 19
- Vitalik Buterin wrote the Ethereum whitepaper at 19
- Many Nigerian tech founders started as teenagers building small tools

### Rules for young builders:

1. **Ship imperfect.** Version 1 doesn't need to be perfect. It needs to be USEFUL.
2. **Talk to users.** Every week, talk to at least 3 students who are NOT your friends.
3. **Don't compare.** Your competitors have teams of 10+ and funding. You're one person. That's okay. Move faster.
4. **Learn in public.** Post your progress on Twitter. "Day 15 of building my exam prep app" → people will help you.
5. **Revenue first.** Don't chase investors. Chase PAYING users. Money from customers is the best validation.
6. **School still matters.** Use CrysLearn yourself to ace YOUR exams. A founder who scored 350 in JAMB is the best marketing.

### When you feel stuck:

- Join developer communities: DevCareer, Google Developer Groups Nigeria, HNG Internship
- Watch YouTube: Fireship, Web Dev Simplified, Traversy Media
- Ask AI (like this conversation) for help
- Take a break. Walk. Come back fresh.

---

## PART 10: FINANCIAL PLAN

### Costs to get started:

| Item | Cost | Notes |
|------|------|-------|
| Supabase (database) | ₦0 | Free tier (500MB, unlimited API) |
| Vercel (hosting) | ₦0 | Free tier (100GB bandwidth) |
| Domain (.com.ng) | ~₦3,000/year | Buy from Whogohost or Qservers |
| Google Play Developer | ~₦15,000 one-time | $25 USD |
| Paystack | ₦0 upfront | They take 1.5% + ₦100 per payment |
| Total to launch | ~₦18,000 | Less than most people spend on a textbook |

### Revenue projections (conservative):

| Month | Users | Revenue | Notes |
|-------|-------|---------|-------|
| Month 1 | 20 | ₦70,000 | Friends, classmates, beta testers |
| Month 2 | 50 | ₦175,000 | Word of mouth, social media |
| Month 3 | 150 | ₦525,000 | Tutorial center partnerships |
| Month 6 | 500 | ₦1,750,000 | Running ads, multiple exams |
| Month 12 | 2,000 | ₦7,000,000 | National brand, school partnerships |

These are CONSERVATIVE. If you hit exam season (Nov-March for JAMB), numbers could 5-10x.

---

## QUICK REFERENCE: Important Links

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Paystack Dashboard:** https://dashboard.paystack.com
- **Expo Dev:** https://expo.dev
- **Your deployed site:** Will be at your-project.vercel.app (then cryslearn.com.ng)

---

## You've got this. 

You're not just building an app — you're building a business that helps millions of Nigerian students succeed. That's something to be proud of at ANY age, let alone 15/16.

Start small. Start today. Ship it. Improve it. Grow it.

**— Your AI Mentor**
