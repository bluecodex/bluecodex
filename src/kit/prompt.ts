import ansiEscapes from "ansi-escapes";
import chalk from "chalk";
import readline from "node:readline/promises";

function logPreviousWithAnswer(args: {
  question: string;
  highlightedAnswer: string;
}) {
  const { question, highlightedAnswer } = args;

  process.stdout.write(ansiEscapes.cursorPrevLine);
  process.stdout.write(ansiEscapes.eraseLine);

  process.stdout.write(`${chalk.dim(question)} ${highlightedAnswer}\n`);
}

type PromptFn = {
  (question: string): Promise<string>;
  bool(question: string, options?: { initial?: boolean }): Promise<boolean>;
};

export const prompt: PromptFn = async (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const questionPromise = rl.question(`${question} `);

  const answer = await questionPromise;
  rl.close();

  logPreviousWithAnswer({
    question,
    highlightedAnswer: chalk.blueBright(answer),
  });

  return answer;
};

prompt.bool = (question, options = {}) => {
  const { initial = true } = options;
  const yesLetter = "y";
  const noLetter = "n";

  const capitalizedYesLetter = initial
    ? yesLetter.toUpperCase()
    : yesLetter.toLowerCase();
  const capitalizedNoLetter = initial
    ? noLetter.toLowerCase()
    : noLetter.toUpperCase();
  const dimmedCapitalizedLetters = chalk.dim(
    [capitalizedYesLetter, capitalizedNoLetter].join("/"),
  );

  process.stdout.write(`${question} ${dimmedCapitalizedLetters}`);
  process.stdout.write(ansiEscapes.cursorMove(-3));

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  return new Promise((resolve) => {
    process.stdin.once("data", (buffer) => {
      process.stdin.setRawMode(false);
      process.stdin.pause();

      const key = buffer.toString("utf-8");

      // Ctrl+C
      const isCtrlC = key === "\u0003";

      const respondedYes = (() => {
        if (isCtrlC) return false;

        if (key === "\r" || key === "\n") return initial;
        return key.toLowerCase() === yesLetter;
      })();

      process.stdout.write("\n");
      logPreviousWithAnswer({
        question,
        highlightedAnswer: respondedYes
          ? chalk.greenBright("Yes")
          : chalk.redBright("No"),
      });

      if (isCtrlC) process.exit();

      resolve(respondedYes);
    });
  });
};
