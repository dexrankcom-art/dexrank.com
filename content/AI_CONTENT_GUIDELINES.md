# AI Content Guidelines

Guidelines for using AI assistance in DexRank content creation while maintaining quality.

## The "Slop" Problem

AI-generated content often exhibits patterns that signal low effort:
- Generic filler phrases ("In the ever-evolving world of...")
- Empty hype words ("revolutionary", "game-changing")
- Vague claims without specific data
- Repetitive sentence structures
- Conclusions that don't follow from the analysis

DexRank content must be **specific, factual, and useful** - not AI slop.

## AI Use Policy

AI tools MAY be used for:
- Research assistance and fact-gathering
- Drafting outlines and structures
- Grammar and clarity improvements
- Generating comparison tables from data
- Summarizing technical documentation

AI output MUST be reviewed for:
- Forbidden phrases (see STYLE_GUIDE.md)
- Generic statements without specific metrics
- Hype language or marketing speak
- Factual accuracy (AI often hallucinates numbers)
- Logical flow and coherence

## Anti-Slop Checklist

Before publishing AI-assisted content, verify:

### Specificity Check
- [ ] At least 3 specific metrics from real data (not AI-invented)
- [ ] At least 1 competitive comparison with named competitor
- [ ] At least 1 user experience observation (fees, speed, UI)
- [ ] All numbers can be traced to database or official source

### Forbidden Pattern Check
- [ ] No sentences starting with "In the..."
- [ ] No uses of "revolutionary", "game-changing", "cutting-edge"
- [ ] No "many experts believe" or "studies show" without citation
- [ ] No conclusions that just restate the introduction

### Readability Check
- [ ] Varied sentence lengths (not all 15-20 words)
- [ ] Active voice dominant (not passive everywhere)
- [ ] Technical terms explained on first use
- [ ] Could a DeFi beginner follow the key points?

## Specific Prompting Techniques

When using AI for DexRank content:

### Good Prompt Patterns
```
"Write an analysis of [Protocol] focusing on:
- TVL: $X billion (provide exact figure)
- Unique feature: [specific differentiator]
- Main tradeoff: [specific limitation]
Avoid generic phrases. Use specific numbers."
```

### Bad Prompt Patterns
```
"Write a review of Uniswap"
-> Too vague, will produce generic content
```

### Post-Generation Editing

After AI generates a draft:
1. Delete any sentence that could apply to ANY protocol
2. Replace all vague metrics with specific numbers from database
3. Add a comparison the AI didn't make
4. Rewrite the opening to lead with a specific fact
5. Ensure the "Best for" recommendation is defensible

## Quality Bar

AI-assisted content should be **indistinguishable** from expert-written content after editing. If a knowledgeable reader could spot "AI voice," the content needs more work.

The goal: Use AI as a research and drafting tool, not as a replacement for expertise.

## Related Documents
- [STYLE_GUIDE.md](./STYLE_GUIDE.md) - Forbidden phrases, structure
- [CONTENT_CHECKLIST.md](./CONTENT_CHECKLIST.md) - Pre-publish checklist
- [CONTENT_UPDATE_SOP.md](./CONTENT_UPDATE_SOP.md) - Update process
