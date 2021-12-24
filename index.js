const core = require("@actions/core");
const github = require("@actions/github");

const run = async () => {
  // Wrap an asynchronous function call
  const result = await core.group("Do something async", async () => {
    try {
      // `who-to-greet` input defined in action metadata file
      const nameToGreet = core.getInput("who-to-greet");
      console.log(`Hello ${nameToGreet}!`);
      const time = new Date().toTimeString();
      core.setOutput("time", time);
      // Get the JSON webhook payload for the event that triggered the workflow
      const payload = JSON.stringify(github.context.payload, undefined, 2);
      console.log(`The event payload: ${payload}`);

      const response = await octokit.request(
        "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs",
        {
          owner_repo: GITHUB_REPOSITORY,
          run_id: GITHUB_RUN_ID,
        }
      );
      return response;
    } catch (error) {
      core.setFailed(error.message);
    }
  });
  console.log(`The event payload: ${result}`);
};

run();
