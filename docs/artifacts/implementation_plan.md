# Fix for 401 Chat Unauthorized and 500 Submission File Tree Errors

This plan outlines the steps to resolve the 401 Unauthorized errors from the chat API and the 500 Internal Server Error when retrieving file trees/contents of seeded submissions.

## User Review Required

> [!IMPORTANT]
> - We will run a script to update the 8 seeded submissions in MongoDB. This will set their `fileStorageKey` field to point to local files and generate mock `.zip` archives containing sample React/JS files in the `backend/uploads/submissions/` directory.
> - We will add an Axios response interceptor on the frontend. If a 401 Unauthorized response is received (e.g., due to an expired or old database token), it will clear the local storage and redirect the browser to `/login`.

## Open Questions

None at this stage.

## Proposed Changes

---

### Backend Components

#### [MODIFY] [submissions.service.ts](file:///c:/Users/TrienChill/OneDrive/Desktop/ART_AI_System/backend/src/services/submissions.service.ts)
- Update `getSubmissionFilePath` to gracefully handle cases where `fileStorageKey` is undefined or null, returning an empty string.
- Update `getSubmissionFileTree`, `getSubmissionFileContent`, and `getSubmissionDownloadFile` to throw a `404 Not Found` `ErrorWithStatus` if `filePath` is empty or the file does not exist on disk, avoiding uncaught `TypeError` or system `ENOENT` errors (which lead to a 500 error).

#### [NEW] [setup-seeded-submissions.js](file:///c:/Users/TrienChill/OneDrive/Desktop/ART_AI_System/tools/scripts/setup-seeded-submissions.js)
- A script to update the 8 seeded submissions in MongoDB and generate corresponding local mock ZIP archives in `backend/uploads/submissions/` so that they can be parsed and viewed successfully in the lecturer interface.

---

### Frontend Components

#### [MODIFY] [axiosClient.ts](file:///c:/Users/TrienChill/OneDrive/Desktop/ART_AI_System/frontend/src/api/axiosClient.ts)
- Add a response interceptor to handle errors. If the response code is 401 (Unauthorized), clear token information from `localStorage` and redirect the user to `/login`.

## Verification Plan

### Automated/Script Verification
- Run `node tools/scripts/setup-seeded-submissions.js` to patch the database and generate mock files.
- Test backend routes `/api/submissions/6a570b2213e22029b8033d33/tree` to ensure they return a valid 200 JSON file tree instead of 500.

### Manual Verification
- Verify that logging out and logging in as a lecturer works correctly.
- Open a lecturer page and ensure that no 401 console errors appear on Chat loading.
- Verify that viewing the submission details forNguyen Van A (`6a570b2213e22029b8033d33`) displays a complete, interactive file tree and loads the file content correctly without crashing.
