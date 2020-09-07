import {
  APIGatewayEvent,
  APIGatewayProxyHandler,
  Callback,
  Context,
} from "aws-lambda";
import "source-map-support/register";

import { Evaluation, SkillData } from "./interfaces";
import { randomString } from "./util/functions";
import { sendSlackMessage } from "./util/slackNotify";

export const skillChecker: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
): Promise<any> => {
  let data = new SkillData();

  try {
    data = (event as any) as SkillData;

    // Check skills -- Max -> 50, MIN -> 25, MIDDLE -> 35
    var topSkills = 0.0;

    var reactJS = 1 * (data?.skills?.reactJS as number);
    var reactNative = 1 * (data?.skills?.reactNative as number);
    var nodeJS = 1 * (data?.skills?.nodeJS as number);
    var aws = 1 * (data?.skills?.aws as number);
    var noSql = 1 * (data?.skills?.noSql as number);
    console.log("reactJS => " + data);
    topSkills += reactJS + reactNative + nodeJS + aws + noSql;

    // MAX OO
    var otherSkills = 0.0;
    if (data?.skills?.otherSkills) {
      for (var i = 0; i < data?.skills?.otherSkills?.length; i++) {
        otherSkills += 0.1 * (data.skills?.otherSkills[i]?.level as number);
      }
    }

    // Message to develop by score and message
    var message = "";
    var code = Math.floor(Math.random() * 100000);
    var score = topSkills + otherSkills;

    if (topSkills >= 35) {
      var a = randomString(1, "AB");
      message =
        "Wow you are the ideal candidate to us, submit an issue in our Github with your score and the code into the [" +
        score +
        "-" +
        a +
        "-" +
        code +
        "]";
    } else if (topSkills >= 25) {
      var a = randomString(1, "CD");
      message =
        "You have a potential to us, submit an issue in our Github with your score and the code into the [" +
        score +
        "-" +
        a +
        "-" +
        code +
        "]";
    } else if (topSkills < 25) {
      message =
        "Thank you, you arrived here and we think that you are in one right way. Unfortunately we are not looking for developers with this profile at the moment :)";
    }

    let evaluation = new Evaluation();
    evaluation.score = score;
    evaluation.message = message;

    if (score) {
      await sendSlackMessage(data.userSetting, evaluation);

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        body: JSON.stringify(evaluation),
      };
    } else {
      throw new Error("Something is wrong with the data sent.");
    }
  } catch (error) {
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify(
        {
          message: "Something is wrong with the data sent." + error,
          input: event.body,
        },
        null,
        2
      ),
    };
  }
};
