# Security Policy

Please report vulnerabilities through a [private security advisory](../../security/advisories/new).

- Runtime dependencies are only `react` and `react-dom`. CI fails if `npm audit --omit=dev` reports anything.
- Build-time tooling (`@webflow/webflow-cli` and its transitive dependencies) currently has npm audit advisories. These packages run only on a developer machine or in CI and are not shipped in the component bundle. Dependabot tracks them as a group.
- Components never use `dangerouslySetInnerHTML`. Rich text comes in as React nodes from Webflow's `RichText` prop.
- External links opened in a new tab get `rel="noopener noreferrer"`.
- The Workspace API token used by `webflow devlink import` lives in `.env`, which is git-ignored.
