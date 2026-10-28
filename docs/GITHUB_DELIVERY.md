# GitHub source and downloadable files

The Study Table source is connected to [ijakesilverstein/study-table](https://github.com/ijakesilverstein/study-table). Branch main and all 17 release tags through V126 were pushed successfully, and remote refs were compared with the saved local commits. The initial write-access denial was resolved before the successful push. No files were transferred through LaunchWell and no Vercel Git deployment was enabled.

The existing native Git connection supports reads and pushes to this repository. GitHub API requests are still blocked in the current workspace, so hosted Actions status has not been verified here. Keep that limitation separate from the verified successful Git upload; no new token is needed for the working Git route.

## Downloading the files

The existing **Check source and lessons** workflow runs on pushes and pull requests and can also be started manually. It retains all existing dependency installation and lesson tests. After those checks succeed, it packages the current release and uploads the actual HTML and ZIP as a **study-table-downloads** artifact.

In GitHub, open **Actions → Check source and lessons → a successful run → Artifacts → study-table-downloads**. GitHub downloads an artifact archive containing the standalone HTML and its ZIP. Extract that archive to access the files. For V130 they are named `Study_Table_V130.html` and `Study_Table_V130.zip`. The current version comes from package.json, so later source releases update the filenames automatically.

The HTML is also committed at `public/study-table-v130.html` for this release. Its exact SHA-256 is `c0d8c23e8ec6f120da44c8e1aa80ecfbe66c81ec9ffa716cec10a79d38a64225`. On GitHub, open that file and use its raw-file download control. Private repository and Actions downloads require an authorized GitHub account; these are separate from public website downloads.

Artifacts are kept for 30 days. Source files and release tags remain in the repository. The workflow requests contents read access, uses no deployment credentials and does not create a GitHub Release or deploy Vercel. No automatic Vercel Git deployment is enabled by this change.

## Verification and limits

The local build check and the workflow's packaging command are executed before committing this configuration. The produced HTML must exactly match the saved V130, and the ZIP must contain that same HTML. YAML structure, triggers, permissions and artifact paths are checked locally. Push access and matching remote main/tags have been verified. Hosted Actions execution must still be confirmed on GitHub before claiming its artifact download is ready. V127 combines the concurrent optional guided-step branch with further authored teaching and piano support. V128 adds authored answer checks in five lessons. V130 merges the further concurrent coaching branches into the shared readers and retains all those improvements; local results are recorded in their release checkpoints. Hosted CI and website publication require separate verification.
