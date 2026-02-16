interface RollResult {
  dicePool: number;
  difficulty: number;
  successes: number;
  diceResults: number[];
  spec?: boolean;
}

export function rollDice(
  dicePool: number,
  difficulty: number,
  spec?: boolean,
): RollResult {
  let successes = 0;
  let diceResults = [];
  for (let i = 0; i < dicePool; i++) {
    const roll = Math.ceil(Math.random() * 10);
    diceResults.push(roll);
    if (roll >= difficulty) successes++;
    if (roll === 10 && spec) successes++;
    if (roll === 1) successes--;
  }
  return { dicePool, difficulty, successes, diceResults, spec };
}

export function getRollResultMessage(roll: RollResult): string {
  const diceResult = roll.diceResults.map((die) => {
    switch (die) {
      case 1:
        return `[2;31m${die}[0m`;
      case 10:
        return `[0;32m${die}[0m`;
      default:
        return `${die}`;
    }
  });

  return (
    `Difficulty: ${roll.difficulty}\nDice Pool: ${roll.dicePool}` +
    `\`\`\`ansi\nResult: ${diceResult.join(", ")}\`\`\`` +
    `\n**Successes: ${roll.successes}**`
  );
}

export function isDicePoolValid(dicePool: number): boolean {
  return !(isNaN(dicePool) || dicePool <= 0 || dicePool > 100);
}
