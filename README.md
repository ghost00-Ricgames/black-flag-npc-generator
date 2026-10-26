# Black Flag NPC Generator

**Public beta v0.2.2 — compact interface and prompt-only ChatGPT backgrounds.** A GM-only NPC generator for the **Black Flag Roleplaying** system (**Tales of the Valiant**) in **Foundry VTT v14**.

This module follows the *structure* of the NPC-generation workflow described in Chapter 6 of the *Tales of the Valiant Game Master's Guide*: three base roles (ally, antagonist, background), a **separately toggleable quest-giver role**, an **optional antagonist scheme**, a name table (d100), and seven descriptive categories (d20). It also supports recording starting attitude and faction status as optional GM notes.

**It does not contain copyrighted table entries from the Game Master's Guide.** It ships original replacement tables. If you own the book, you may manually prepare a private JSON pack from your own notes and import it locally. **Do not upload copyrighted tables to a public repository unless you have distribution rights.**

## Install the public beta

### Manual ZIP installation (alternative)

1. Extract `black-flag-npc-generator.zip` into your Foundry **Data/modules/** directory, producing `Data/modules/black-flag-npc-generator/module.json`.
2. Restart Foundry and enable **Black Flag NPC Generator** in the Black Flag world.
3. Open the **Actors** sidebar and click **NPC Generator**. If your directory layout does not show that button, open **Game Settings → Configure Settings → Module Settings → Open NPC Generator** instead.
4. A GM can also run the console command `game.modules.get('black-flag-npc-generator').api.open()`.

### GitHub manifest installation (recommended after the public release)

Paste the release manifest into Foundry's **Install Module → Manifest URL** field:

`https://raw.githubusercontent.com/ghost00-Ricgames/black-flag-npc-generator/main/module.json`

This manifest points to the public beta release asset and can receive updates when the repository's main-branch manifest version changes. The v0.2.2 beta is published as a GitHub **pre-release**, so it will not appear under GitHub's `/releases/latest/` endpoint.

**Publisher setup:** The repository owner must first create the public `ghost00-Ricgames/black-flag-npc-generator` repository. Upload this source tree to the `main` branch, ensure GitHub Actions are enabled, then push `module.json` to `main` **after all other files** (or commit everything together). GitHub Actions will test, create the `v0.2.2` beta tag, and attach the install ZIP and `module.json` to the pre-release. See [PUBLISHING.md](PUBLISHING.md).

## ChatGPT background prompts (optional)

Disabled by default. In **Game Settings → Configure Settings → Module Settings → Black Flag NPC Generator**, use **NPC Backgrounds — ChatGPT Prompt**. There are just two choices:

- **Off:** No ChatGPT account or AI tools required. The normal NPC generator works as before.
- **ChatGPT Prompt (copy and paste):** Works with **ChatGPT Free, Go, Plus, or Pro**. Builds a custom NPC prompt you copy into ChatGPT, then lets you paste and edit the returned background. **No API key, API account, or direct sign-in is required.**

Automatic AI generation and API connections are **not included** in this release. Existing worlds using the removed `ChatGPT plan` or `OpenAI API` settings from v0.2.0 will be switched to **ChatGPT Prompt** when a GM first loads the updated module; no account credentials are migrated or stored.

For the six-step copy/paste workflow and privacy notes, see **[AI-SETUP.md](AI-SETUP.md)**.

The prompt includes the NPC's **current edited details**, active role branches, optional social information, selected length/tone, and optional campaign context. Once pasted, a background is editable and is saved to the Actor **Biography** or Journal along with the dice-generated characteristics.

## Using the generator

- **Quick:** base role, optionally quest giver / scheme, name, notable feature, and personality.
- **Full:** base role plus all seven descriptive fields.
- **Custom:** individually toggle name, notable feature, profession, personality, bond, flaw, and want.
- **Locks:** click Lock beside a result to keep it through subsequent Generate NPC rolls. Locked text can still be manually edited. Unlock to reroll it.
- **Edit:** text boxes are editable; custom text saves to Journals/Actors while the original die result is retained as a recorded source value.
- **Save Journal:** a JournalEntry with an editable NPC Profile page, including GM details and rolls.
- **Create NPC Actor:** creates a new Black Flag NPC with default system data; or select an existing world NPC Actor as a statistical template and copy it. **All generated notes are written into the NPC sheet’s Biography (`system.biography.value`)**, including the base role, optional quest-giver / scheme information, descriptive fields, and any selected attitude or faction status. Existing template biography text is retained above the generated profile. Rolls and structured data are also recorded in `flags.black-flag-npc-generator.generated`; the original template Actor is never modified.
- **Local table packs:** import customized tables from JSON. Each imported table overrides only its own category. Imported data is saved in the world settings (visible to GMs with access to the world database). A reset command removes all overrides.

### Import pack format

`JSON template` in the generator downloads an example. Schema:

```json
{
  "tables": {
    "flaw": ["twenty original lines, one per d20 face", "..."],
    "name": ["one hundred names, one per d100 face", "..."]
  }
}
```

Each array must contain **exactly** 20 or 100 non-empty strings, based on the category. You may supply only the categories you want to override. Supported keys:

| Key | Die | Description |
| --- | --- | --- |
| `ally` | d20 | Ally role concept |
| `antagonist` | d20 | Antagonist role concept |
| `background` | d20 | Background NPC concept |
| `questGiver` | d20 | Quest giver (overlay) |
| `scheme` | d20 | Antagonist's villainous scheme |
| `name` | d100 | Full NPC name |
| `feature` | d20 | Notable appearance |
| `profession` | d20 | Occupation |
| `personality` | d20 | Personality trait |
| `bond` | d20 | Bond |
| `flaw` | d20 | Flaw |
| `want` | d20 | Want / motivation |

The NPC module does **not** automatically extract anything from PDFs or official content packs. Data is provided by the GM.

## Reporting bugs and requesting features

Please open a [GitHub issue](https://github.com/ghost00-Ricgames/black-flag-npc-generator/issues) using the **Bug report** or **Feature request** template. For bugs, include Foundry version, Black Flag system version, steps to reproduce, the expected and actual result, and relevant browser-console errors (with personal campaign data removed).

## Manual test checklist

- [ ] Game Settings displays only Off and ChatGPT Prompt; the default is Off.
- [ ] Normal NPC generation still works with the option Off.
- [ ] With ChatGPT Prompt selected, copy an NPC prompt and open ChatGPT in a new tab.
- [ ] Confirm prompt includes edited NPC details, role branches, tone/length, and campaign context.
- [ ] Paste a backstory and verify it appears safely in the Actor Biography and Journal.
- [ ] If upgrading from v0.2.0 with a discontinued AI provider selected, verify it switches to ChatGPT Prompt.
- [ ] v14 Black Flag world loads module with no console errors.
- [ ] Actors directory launch button appears (or module settings fallback works).
- [ ] Quick, Full, and Custom each generate their intended keys.
- [ ] Quest giver works for ally, antagonist, and background.
- [ ] Villainous scheme is available only for antagonist.
- [ ] Individual Reroll updates only one unlocked result.
- [ ] Locks protect saved edits during Generate NPC.
- [ ] Optional attitude and faction status show in Journal and Actor Biography.
- [ ] NPC Actor created and shows all generated notes in Biography.
- [ ] NPCs using a stat template retain the template’s original biography above new notes.
- [ ] Import valid local JSON, reject invalid/short tables, reset.

## Development

`npm test` and `npm run check` require Node 20+ but no external dependencies. The code uses the v14 `ApplicationV2` framework and DOM rendering, avoiding legacy AppV1.

## License

Code and original sample tables: MIT, see `LICENSE`. No Kobold Press text or art has been included in this repository. Tales of the Valiant, Black Flag, and Kobold Press are trademarks of Open Design LLC. This module is an independent fan tool and is not affiliated with or endorsed by Kobold Press.


### Compact beta interface (0.2.2)

The compact workshop places Reroll and Lock in each field's heading. Social options, Table packs, and ChatGPT Background are expandable sections and start collapsed. Open a section by clicking its heading; its state is preserved when rerolling or changing generator options. The original Quick, Full, and Custom modes remain available.