# Content Update SOP

Standard Operating Procedure for keeping DexRank content current and accurate.

## Update Triggers

Content should be reviewed and updated when ANY of these occur:

### Automatic Triggers (Check Weekly)
- [ ] TVL changes >20% from published figure
- [ ] Volume changes >30% from published figure
- [ ] Rank position changes >5 places
- [ ] Chain count changes (new chains added/removed)

### Event Triggers (Monitor Continuously)
- [ ] Protocol major version release (v2 to v3, major UI overhaul)
- [ ] Security incident (hack, exploit, vulnerability disclosure)
- [ ] Token launch or governance change
- [ ] Protocol shutdown or significant feature deprecation
- [ ] Merger, acquisition, or rebrand

### Scheduled Review (Monthly)
- [ ] All Tier 1 content (top 10 by TVL) reviewed monthly
- [ ] All Tier 2 content (11-50 by TVL) reviewed quarterly
- [ ] Guides reviewed semi-annually (unless topic becomes outdated)

## Update Process

### Step 1: Identify Scope
1. Determine which sections need updates (metrics only? analysis? both?)
2. Check if update changes the "Best for" recommendation
3. Check if competitive comparisons are still accurate

### Step 2: Update Content
1. Pull latest metrics from database
2. Update specific numbers in text
3. Revise analysis if fundamentals changed
4. Update any screenshots or visual references

### Step 3: Metadata
1. Update `lastUpdated` frontmatter to today's date
2. Keep `publishedAt` as original date (do not change)
3. If major rewrite, consider new publishedAt + note about revision

### Step 4: Quality Check
1. Run through CONTENT_CHECKLIST.md
2. Verify no forbidden phrases (STYLE_GUIDE.md)
3. Ensure at least 3 specific metrics are current
4. Read aloud for natural flow

### Step 5: Deploy
1. Commit with message: `content(reviews): update [protocol] metrics`
2. Deploy (ISR will pick up changes within revalidation window)

## Priority Matrix

| Trigger Type | Response Time | Owner |
|--------------|---------------|-------|
| Security incident | Same day | Lead editor |
| Major version release | 1-2 days | Content team |
| Significant metric change | 1 week | Content team |
| Scheduled review | Per schedule | Assigned reviewer |

## Audit Trail

Track content updates in git history. Commit messages should indicate:
- Which protocol/guide updated
- What triggered the update
- Whether metrics-only or full revision

Example commit messages:
- `content(reviews): update uniswap-v3 TVL figures`
- `content(reviews): revise hyperliquid after v2 launch`
- `content(guides): refresh impermanent-loss with 2026 examples`

## Related Documents
- [STYLE_GUIDE.md](./STYLE_GUIDE.md) - Voice, tone, structure
- [CONTENT_CHECKLIST.md](./CONTENT_CHECKLIST.md) - Pre-publish checklist
- [AI_CONTENT_GUIDELINES.md](./AI_CONTENT_GUIDELINES.md) - AI content quality
