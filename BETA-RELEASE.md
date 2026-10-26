# Black Flag NPC Generator — v0.2.2 Public Beta

A GM-only NPC workshop for Foundry VTT 14 and the **Black Flag Roleplaying / Tales of the Valiant** system.

Generate NPCs with selectable fields, individual rerolls and locks, optional quest-giver and antagonist branches, and editable biographies. Save as an NPC Actor (including `system.biography.value`) or Journal. The optional ChatGPT **copy/paste prompt** works through the ChatGPT website, with no API account or API key.

## Install

In Foundry, choose **Add-on Modules → Install Module → Manifest URL** and paste:

`https://raw.githubusercontent.com/ghost00-Ricgames/black-flag-npc-generator/main/module.json`

Then enable the module in a **Black Flag** world and use the **NPC Generator** button in the Actors sidebar, or the launcher in module settings.

## Please test and report

We'd value feedback on the compact interface, Custom field selection, rerolls and locks, Actor Biography output, Journal export, and ChatGPT prompt workflow. Report bugs or make suggestions using the [GitHub Issues tab](https://github.com/ghost00-Ricgames/black-flag-npc-generator/issues).

Include Foundry version, Black Flag version, reproduction steps, and sanitized console errors when reporting a bug.

## Current limitations

- GM-only; tested through automated checks, but community compatibility testing is welcome.
- Optional ChatGPT support is **manual copy/paste**, not direct account/API integration.
- Includes original sample tables, **not** the copyrighted tables from the *Tales of the Valiant Game Master's Guide*. GMs can import local JSON table overrides.
- No automatic portrait generation or inferred combat statistics; choosing an existing NPC Actor as a template reuses that Actor's statistics.

Independent fan utility; not affiliated with or endorsed by Kobold Press. Source released under MIT.