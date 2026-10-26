# ChatGPT NPC Background Prompts (v0.2.2)

The NPC generator works fully without ChatGPT. Background prompt assistance is **Off** by default.

## Enable copy-and-paste prompts

In your Black Flag world, go to **Game Settings → Configure Settings → Module Settings → Black Flag NPC Generator → NPC Backgrounds — ChatGPT Prompt**.

| Choice | Subscription | Function |
| --- | --- | --- |
| **Off** | None | Use the standard random NPC generator |
| **ChatGPT Prompt (copy and paste)** | ChatGPT Free, Go, Plus, or Pro | Copy an NPC-specific prompt into ChatGPT, then paste the resulting background back into Foundry |

**No OpenAI API account or API key is required.** The module does not sign in to ChatGPT, use your subscription for direct requests, or automatically generate text. API and account-connected options have been removed from the user interface in this release. We can reconsider them in a future version.

## How to generate a background

1. Enable **ChatGPT Prompt (copy and paste)** in Game Settings.
2. Open the NPC Generator and roll or edit the NPC's characteristics.
3. Choose the desired **length**, **tone**, and optional **campaign context**.
4. Click **Copy ChatGPT prompt**, followed by **Open ChatGPT**. Paste the prompt into the ChatGPT website.
5. Copy the generated text from ChatGPT back into Foundry's **Background (paste or edit)** box. Edit it as desired.
6. Click **Create NPC Actor** or **Save Journal**. The edited background appears with the generated character notes in the Actor **Biography** or Journal.

If copying fails due to browser permissions, expand **View generated prompt / copy manually** and copy the text yourself.

## Upgrading from v0.2.0

The only AI selections in v0.2.2 are **Off** and **ChatGPT Prompt**. Previously saved `ChatGPT plan` or `OpenAI API` selections are automatically changed to **ChatGPT Prompt** after a GM loads the world. No bridge, companion service, API token, or separate setup is needed. Already-created Actors and their biographies are not changed.

## Privacy and safety

The module creates the prompt locally and **does not transmit it**. Only you decide what to paste into ChatGPT. Do not include private secrets in optional campaign context or NPC notes you do not wish to share with ChatGPT. Pasted background text is treated as plain text and HTML-escaped when saved into Foundry. Nothing from the Game Master's Guide's copyrighted random tables is bundled in the release.