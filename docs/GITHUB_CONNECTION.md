# GitHub connection status

The local Study Table project is ready for a dedicated private repository. The existing LaunchWell Labs checkout has not been changed.

Intended target: `ijakesilverstein/study-table`. Check its availability and the authenticated account before creating it. A repository read returned “Repository not found”; that does not prove it is absent rather than inaccessible.

GitHub API calls currently fail at the environment’s network proxy with CONNECT 403. Do not treat the CLI’s resulting invalid-token message as proof that a new credential is required. Existing platform GitHub HTTPS read authentication should be checked again after API access is enabled.

A cloud environment configuration draft was successfully saved adding `api.github.com` and `uploads.github.com`, preserving the existing `api.vercel.com`, `vercel.com` and package-manager preset access. The tool reported `requires_publish: true`. Saving this draft does not apply it. The user must review/save the pending changes in environment settings and publish the environment.

Once access is active:

1. Verify the GitHub account with `gh api user --jq .login` without exposing credentials.
2. Inspect the intended repository. Create it privately only if it is absent; inspect and reconcile existing work if present.
3. Push the reviewed local `main` commit without force.
4. Connect the existing Vercel project `study-table-v102` to this GitHub repository. Preserve its production URL and verify the Vercel GitHub integration can access the private repository.
5. Verify a Git-backed preview or deployment before claiming automatic deployment is connected.

No GitHub remote has been created, pushed, or connected to Vercel yet. The local deployment link under `.vercel/` is excluded from Git. Do not commit credentials, caches, local browser profiles, or learner storage.
