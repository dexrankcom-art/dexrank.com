# Project Rules

## GSD Workflow Rules

- After `/gsd:plan-phase` completes for ANY phase (1, 2, or any other), the next step is ALWAYS `/gsd:execute-phase {X}` - even if only 1 plan was created.
- After `/gsd:execute-phase` completes for ANY phase, ALWAYS run `/gsd:verify-work` automatically to validate the built features.
