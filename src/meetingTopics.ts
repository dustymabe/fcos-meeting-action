import * as core from '@actions/core'
import { Octokit } from '@octokit/rest'
export async function GetMeetingTopics(): Promise<string> {
  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    })
    const [owner, repo] = core.getInput('trackingRepo').split(`/`)

    const issues = await octokit.issues.listForRepo({
      owner,
      repo,
      labels: `meeting`,
      state: `open`
    })
    if (issues.data.length === 0) {
      return `#topic No meeting topics found.`
    }

    let issuesToBeDiscussed = ``
    for (let i = 0; i < issues.data.length; i++) {
      issuesToBeDiscussed += `    - [ ] \`#topic ${issues.data[i].title}\`  \n`
      issuesToBeDiscussed += `        - \`#link ${issues.data[i].html_url}\`  \n`
    }
    return issuesToBeDiscussed
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
  return `Failed: to get meeting topics, requires manual intervention.`
}
