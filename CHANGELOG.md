# Changelog

## 0.2.2 — Compact UI beta polish

- Reduced the generator's initial window size from 830 × 820 to 790 × 690 pixels.
- Put field-specific reroll and lock actions beside each result heading; tightened field spacing while keeping editable text areas.
- Collapsed infrequently used Social options, Table packs, and ChatGPT Background sections by default, preserving their open state while regenerating.
- Preserved the scroll position after rerolls and made the layout adapt to the module window width.
- Kept Quick/Full/Custom, field selection, roll results, Actor/Journal export and generation logic unchanged.
- Added interface regression tests; v0.2.1 remains the stable fallback.


## 0.2.1 — ChatGPT prompt-only simplification

- Game Settings offers only Off and ChatGPT Prompt (copy/paste); Free, Go, Plus, and Pro plans can be used through the ChatGPT website.
- Removed unfinished ChatGPT-plan sign-in and separate API choices, local bridge settings, API-request controls, and bundled companion server.
- Added backward-compatible conversion for previously saved ChatGPT-plan/API selections to ChatGPT Prompt.
- Retained tailored prompt generation, tone/length/context, background editing, NPC Biography and Journal export, and full random NPC generation.
- Updated documentation and automated tests for the simplified workflow.


## 0.2.0 — AI Background Provider Settings

- Added GM-selectable Game Settings for AI backgrounds: Off (default), manual ChatGPT (Free/Go/Plus/Pro), ChatGPT plan (Plus/Pro; **manual fallback until secure OAuth companion ships**) and separately billed OpenAI API (optional localhost companion).
- Added a tailored background prompt generator with character role, conditional branches, editable table results, selected tone/length and campaign context.
- Added Copy Prompt, Open ChatGPT, manual prompt view, and an editable AI Background field in the generator.
- Exported reviewed AI backgrounds to the Black Flag NPC Biography and Journal alongside generated notes.
- Added a localhost-only Node.js OpenAI API bridge for optional one-click API requests; API keys remain in the companion process and never in Foundry world settings.
- Added AI/provider, prompt, bridge and background escaping regression tests.
- Updated README and added AI-SETUP.md for user-facing subscription requirements and limitations.



## 0.1.1 — NPC Biography notes
- Generated NPC profiles now populate the Black Flag NPC Biography field (`system.biography.value`), visible on the Actor sheet.
- Notes include role branches, all generated characteristics, optional attitude and status, and recorded die rolls.
- When copying NPC statistics, append the new profile to the existing biography rather than replacing it.
- Preserve generated structured data in module flags for future edits.

## 0.1.0 — initial playtest
- Foundry v14 / Black Flag v3 compatible module structure
- Full NPC role branching, d20/d100 original sample tables
- Quick, Full, Custom generation modes, locks, rerolls, editing
- Optional social attitude and faction status notes
- Create editable JournalEntry or NPC Actor; optionally clone an existing NPC stat template
- Private JSON table-pack import, validation, reset, and export template
- Automated engine tests and draft GitHub Release workflow