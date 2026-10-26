# Publishing the v0.2.2 Public Beta

The `ghost00-Ricgames/black-flag-npc-generator` repository must exist before publishing. This project deliberately uses a pre-release: GitHub's `/releases/latest/` URL does **not** resolve to pre-releases. The install manifest is therefore hosted in the repository's **main** branch.

## One-time GitHub setup

1. Go to <https://github.com/new> while signed into the `ghost00-Ricgames` account.
2. Set **Repository name** to `black-flag-npc-generator`, select **Public**, and create it. An empty repository works best; do not add a README, license, or `.gitignore` in the web setup because this source contains them already.
3. Push the files in this source ZIP (including dot-directories such as `.github`) to the new repository's `main` branch.
4. In **Settings → Actions → General**, make sure GitHub Actions are allowed and that the workflow has permission to create release assets (the workflow requests `contents: write`). Organization policy may override these settings.
5. Upload `module.json` **last** when creating files individually through the GitHub API. A push to `main` that includes `module.json` automatically runs `npm run check` and `npm test`, builds the installable ZIP, creates the matching `v0.2.2` tag, and publishes a **pre-release** with two assets (`module.json` and ZIP). A single initial Git commit containing all files also works.
6. Verify that the **Package Foundry module** workflow succeeded, that the tagged release has two assets, and the manifest URL and ZIP URL both download. Test installation using the manifest URL in the release notes.

## Typical command-line publication (from the extracted source directory)

```bash
git init
git branch -M main
git add .
git commit -m "Release Black Flag NPC Generator public beta v0.2.2"
git remote add origin https://github.com/ghost00-Ricgames/black-flag-npc-generator.git
git push -u origin main
# GitHub Actions creates the release tag and assets automatically.
```

If a GitHub-connected assistant uploads the source files directly after the repository is created, it can commit the individual files via the GitHub connector and upload `module.json` last to trigger publishing. Do not publish before the source files and release workflow are present.

## Update strategy

For each subsequent version, update `module.json`, `package.json`, change the `download` URL to the **new tagged release**, and update docs; merge the version bump to `main` before the release workflow runs on the manifest change. This lets Foundry follow the stable **raw main-branch manifest URL** even when the latest release is a beta pre-release.

When publishing the first stable major release (v1.0.0), review the GitHub workflow's beta notes and prerelease toggle. The current workflow marks `v0.*` releases as prereleases.