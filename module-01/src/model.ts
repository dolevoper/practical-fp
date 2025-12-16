export type Card = {
    front: string,
    back: string,
    successCount: number,
    easinessFactor: number,
    interval: number,
    lastSeen: number
};

export type Deck = {
    id: string,
    name: string,
    unseenCards: Card[],
    seenCards: Card[],
    lastStudied: number
};

export type Grade = 0 | 1 | 2 | 3 | 4 | 5;

export function parseGrade(grade: unknown): Grade {
    const numericGrade = Number(grade);

    if (numericGrade < 0 || numericGrade > 5 || !Number.isInteger(numericGrade)) {
        throw new Error();
    }

    return numericGrade as Grade;
}

function calcUpdatedInterval(grade: Grade, card: Card) {
  if (grade < 3) {
    return 1;
  }

  if (card.successCount === 0) {
    return 1;
  }

  if (card.successCount === 1) {
    return 6;
  }

  return Math.round(card.interval * card.easinessFactor);
}

function calcUpdatedSuccessCount(grade: Grade, card: Card) {
  return grade >= 3 ? card.successCount + 1 : 0;
}

function calcUpdatedEasinessFactor(grade: Grade, card: Card) {
  return Math.max(
    1.3,
    card.easinessFactor + 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02),
  );
}

export function calcUpdatedCard(grade: Grade, lastSeen: number, card: Card): Card {
  return {
    ...card,
    interval: calcUpdatedInterval(grade, card),
    successCount: calcUpdatedSuccessCount(grade, card),
    easinessFactor: calcUpdatedEasinessFactor(grade, card),
    lastSeen,
  };
}
