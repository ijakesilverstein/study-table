# GitHub source and downloadable files

The Study Table source is already a Git repository with the full release history and tags through V126. The separate GitHub repository has not yet been connected. Git read access to the existing LaunchWell repository works; the proposed Study Table destination returns Repository not found, and API requests for repository creation are blocked by the workspace proxy. This does not establish write access to a new repository.

Create an empty private repository named `study-table` in the intended GitHub account, without an initial README, license or gitignore, then provide its URL. The saved local source can be pushed directly after verifying access. No manual transfer of the HTML between chats is required. Keep Study Table separate from LaunchWell. Do not describe the connection as complete until a push succeeds and its remote commit is verified.

## Downloading after connection

The existing **Check source and lessons** workflow runs on pushes and pull requests and can also be started manually. It retains all existing dependency installation and lesson tests. After those checks succeed, it packages the current release and uploads the actual HTML and ZIP as a **study-table-downloads** artifact.

In GitHub, open **Actions → Check source and lessons → a successful run → Artifacts → study-table-downloads**. GitHub downloads an artifact archive containing the standalone HTML and its ZIP. Extract that archive to access the files. For V126 they are named `Study_Table_V126.html` and `Study_Table_V126.zip`. The current version comes from package.json, so later source releases update the filenames automatically.

The HTML is also committed at `public/study-table-v126.html` for this release. Its exact SHA-256 is `d46a345c5d308ec8821fb62a4c2d8d14e6363be8d009097b35d761f700ac23e6`. On GitHub, open that file and use its raw-file download control. Private repository and Actions downloads require an authorized GitHub account; these are separate from public website downloads.

Artifacts are kept for 30 days. Source files and release tags remain in the repository. The workflow requests contents read access, uses no deployment credentials and does not create a GitHub Release or deploy Vercel. No automatic Vercel Git deployment is enabled by this change.

## Verification and limits

The local build check and the workflow's packaging command are executed before committing this configuration. The produced HTML must exactly match the saved V126, and the ZIP must contain that same HTML. YAML structure, triggers, permissions and artifact paths are checked locally. Hosted Actions execution and GitHub push access cannot be claimed until the remote is available and the workflow actually runs there. Existing full V126 lesson-regression results remain recorded in the release checkpoint.
