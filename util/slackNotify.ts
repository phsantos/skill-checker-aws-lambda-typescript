import axios from "axios";

import { Evaluation, UserSetting } from "../interfaces";

const webHookURL = process.env.webHookURLSlack;

/**
 * Handles the actual sending request.
 * @param messageBody
 * @return {Promise}
 */
async function slackMessage(messageBody) {
  try {
    messageBody = JSON.stringify(messageBody);
  } catch (e) {
    throw new Error("Failed to stringify messageBody" + e);
  }

  try {
    const result = await axios.post(webHookURL, messageBody);
    return result;
  } catch (ex) {
    throw new Error(ex);
  }
}

export async function sendSlackMessage(
  userSetting: UserSetting,
  evaluation: Evaluation
) {
  if (!webHookURL) {
    console.error("Please fill in your Webhook URL");
  }

  try {
    const userAccountNotification = {
      username: "Skill Checker",
      text: evaluation.message,
      icon_emoji:
        evaluation.score >= 35
          ? ":v:"
          : evaluation.score >= 25
          ? ":+1:"
          : ":thumbsdown:",
      attachments: [
        {
          color:
            evaluation.score >= 35
              ? "#048645"
              : evaluation.score >= 25
              ? "#eed140"
              : "#de3143",
          fields: [
            {
              title: "Score",
              value: "score: " + evaluation.score,
              short: true,
            },
            {
              title: "GitHub",
              value: userSetting?.githubProfile || "unknown",
              short: true,
            },
          ],
        },
      ],
    };

    await slackMessage(userAccountNotification);
  } catch (e) {
    console.error("There was a error with the request", e);
  }
}
