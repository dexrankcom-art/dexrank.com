# DexRank Editorial Style Guide

## Voice and Tone

**Informative, direct, no hype.** We are educators, not marketers.

- Write for someone researching their first DEX, not crypto insiders
- Be specific over vague: "$2.1B TVL" not "massive liquidity"
- State facts, let readers draw conclusions
- Acknowledge tradeoffs honestly

## Forbidden Phrases

These phrases signal AI-generated or low-quality content. Never use:

### Generic Filler
- "In the ever-evolving world of..."
- "In today's fast-paced crypto landscape..."
- "It's worth noting that..."
- "Needless to say..."
- "At the end of the day..."
- "When it comes to..."
- "One thing is clear..."
- "The bottom line is..."

### Empty Hype
- "Revolutionary" / "game-changing"
- "Cutting-edge" / "state-of-the-art"
- "Best-in-class" / "world-class"
- "Unparalleled" / "unmatched"
- "Robust" / "seamless" / "streamlined"
- "Holistic" / "comprehensive solution"

### Weasel Words
- "Many experts believe..."
- "Some users report..."
- "It is widely known..."
- "Studies have shown..." (without citation)

## Structure for Editor's Take

### Tier 1 DEXs (Top 10 by TVL) - 800-1200 words

1. **Opening hook** (1-2 sentences): What makes this DEX notable? Use a specific fact.
2. **Core value proposition** (2-3 sentences): What problem does it solve? For whom?
3. **Key differentiators** (2-3 paragraphs): What sets it apart from competitors? Use data.
4. **Honest limitations** (1 paragraph): Where does it fall short? What are the tradeoffs?
5. **Best for** (1 sentence): Who should use this DEX?

### Tier 2 DEXs (11-50 by TVL) - 300-500 words

1. **Opening context** (1-2 sentences): Position in the market
2. **Key strengths** (1 paragraph): 2-3 standout features with evidence
3. **Notable considerations** (1 paragraph): Important tradeoffs
4. **Best for** (1 sentence): Target user profile

## Data Requirements

Every Editor's Take MUST include:

- **At least 3 specific metrics** from the protocol's data (TVL, volume, chain count, etc.)
- **At least 1 comparison** to a relevant competitor or market position
- **At least 1 user experience observation** (fees, speed, UI complexity)

Example of good specificity:
> "Uniswap v3's concentrated liquidity has captured 68% of Ethereum DEX volume, with $4.2B TVL across 10 chains. The tradeoff: LP positions require active management that casual liquidity providers may find overwhelming."

Example of bad genericity:
> "Uniswap is one of the leading DEXs with significant liquidity and widespread adoption across multiple blockchains."

## Terminology Standards

| Use | Instead of |
|-----|------------|
| DEX | dex, Dex, decentralised exchange |
| TVL | Total Value Locked (on first use, then TVL) |
| LP | liquidity provider (on first use, then LP) |
| AMM | automated market maker (on first use, then AMM) |
| Layer 2 / L2 | layer-2, L-2 |
| self-custody | non-custodial (prefer self-custody) |

## Length Guidelines

| Content Type | Target Length |
|--------------|---------------|
| Tier 1 Editor's Take | 800-1200 words |
| Tier 2 Editor's Take | 300-500 words |
| Beginner Guide | 1500-2500 words |
| Intermediate Guide | 1000-1500 words |
| Advanced Guide | 800-1200 words |
| Category Intro | 150-250 words |

## Updating Content

When metrics change significantly (>20% TVL change, major version update, security incident):

1. Update the `lastUpdated` frontmatter field
2. Review all specific numbers in the content
3. Check if "Best for" recommendation still applies
4. Update any competitive comparisons
