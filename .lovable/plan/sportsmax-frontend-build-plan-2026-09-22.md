# SportsMax Frontend Build Plan

## Goal
Build a polished, responsive SportsMax product prototype that consistently tells the story: **Data → Intelligence → Automation → Engagement**. All metrics, athletes, recommendations, community activity, and charts will be clearly labeled as demo data.

## Visual Direction
- Premium dark sports-technology interface with deep navy surfaces, crisp light typography, electric lime/cyan analytics accents, restrained gradients, and minimal glass effects.
- Use a generated runner-focused visual blended with GPS route, heart-rate, pace, and performance overlays for the home experience.
- Dense, professional dashboards with compact cards, strong hierarchy, accessible contrast, and subtle motion rather than gaming-style neon.
- Responsive sticky navigation, mobile menu, clear focus states, lightweight reveals, chart transitions, metric count-up effects, and reduced-motion support.

## Shared Foundation
- Create reusable navigation, footer, page shell, metric cards, chart containers, filters, insight/recommendation cards, workflow diagrams, community posts, leaderboard, and demo badge components.
- Centralize realistic typed mock data so future API responses can replace it without redesigning pages.
- Add a consistent visual token system, typography, spacing, chart colors, shadows, and motion rules.
- Add a Login / Sign Up dialog for future integration, explicitly presented as a prototype with no real account connection.

## Pages and Experiences
1. **Home** — visual analytics-led introduction, both CTAs, Capture/Analyze/Automate architecture, automated insight feed, internal/external automation flows, fan engagement, and technology layers.
2. **Run Analytics** — session summary, GPS route preview, nine key metrics, interactive period selector, pace/heart-rate/speed/weekly distance/consistency/progression charts.
3. **Analytics Dashboard** — organization KPIs, date and athlete filters, trend/activity/pace-zone charts, and responsive athlete performance table.
4. **Athlete Performance** — demo athlete profile, progress metrics, performance trend charts, and generated insight panel.
5. **Insights** — expandable alerts, training insights, milestones, and recommendation feed with category and timeframe filters.
6. **Recommendations** — recovery, endurance, and consistency recommendations, priority/status controls, evidence metrics, and visible non-medical-advice notice.
7. **Sports Community** — searchable community feed, challenge cards, weekly/monthly/all-time leaderboard filters, event highlights, and fan analytics cards.
8. **About SportsMax** — mission, audiences, complete platform architecture, and internal/external automation explanations.
9. **Contact** — accessible contact form with local success confirmation and clear demo expectations.

## Navigation and Metadata
- Wire every desktop and mobile navigation item to a real page, including Recommendations and Contact through menus/footer.
- Give each page unique SportsMax title, description, Open Graph title/description, type, and Twitter card metadata.
- Keep all primary actions meaningful: navigation, filters, expand/collapse, dialogs, search, and form feedback.

## Validation
- Verify the preview has no build/runtime errors.
- Test every route, desktop and mobile navigation, filters, dialogs, expandable cards, and contact submission.
- Capture desktop and mobile screenshots to confirm charts, tables, text wrapping, generated imagery, and dashboard layouts render without overlap or broken assets.
