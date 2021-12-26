const core = require("@actions/core");
const github = require("@actions/github");
const fetch = require("node-fetch");

const run = async () => {
  // Wrap an asynchronous function call
  const result = await core.group("Do something async", async () => {
    try {
      const githubToken = core.getInput("repo-token");
      const ciReporterToken = core.getInput("ci-reporter-token");
      const ciReporterProject = core.getInput("ci-reporter-project-id");

      const octokit = github.getOctokit(githubToken);
      const { data } = await octokit.rest.actions.listJobsForWorkflowRun({
        owner: process.env.GITHUB_REPOSITORY.split("/")[0],
        repo: process.env.GITHUB_REPOSITORY.split("/")[1],
        run_id: process.env.GITHUB_RUN_ID,
      });

      const resp = await fetch("https://cireporter.com/api/ci/save", {
        method: "POST",
        headers: {
          "ci-reporter-token": ciReporterToken,
        },
        body: JSON.stringify({
          project_id: ciReporterProject,
          ci_name: "github",
          data,
        }),
      });
      const json = await resp.json();
      return json;
    } catch (error) {
      core.setFailed(error.message);
    }
  });
  console.log(`The event payload: ${result}`);
};

run();
