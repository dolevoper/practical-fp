import * as _ from "remeda";

// 1. Write a composed/piped version of stringToJSON
const stringToJSON = _.piped(
  escapeString,
  quote
);
// function stringToJSON(str: string) {
//   const escaped = escapeString(str);

//   return quote(escaped);
// }

function escapeString(str: string) {
  return str
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll("\f", "\\f")
    .replaceAll("\b", "\\b")
    .replaceAll("\r", "\\r")
    .replaceAll("\t", "\\t")
    .replaceAll('"', "\\\"");
}

function quote(str: string) {
  return `"${str}"`;
}



// 2. Write a composed/piped version of arrayToJSON
const arrayToJSON = (arr: (string | number | boolean)[]) => _.pipe(
  arr,
  _.map(primitiveToJSON),
  _.join(", "),
  surroundWithBrackets,
);
// function arrayToJSON(arr: (string | number | boolean)[]) {
//   const arrayOfJSON = arr.map(primitiveToJSON);

//   return surroundWithBrackets(arrayOfJSON.join(", "));
// }

const primitiveToJSON = (value: string | number | boolean) => {
  if (typeof value === "string") {
    return stringToJSON(value);
  }

  return value.toString();
};

function surroundWithBrackets(str: string) {
  return `[${str}]`;
}

// 3. Write a composed/piped version of submitForm
type AppState = {
  error: string,
  shouldShowSpinner: boolean,
  submittedBefore: boolean
};

const submitForm = _.piped(
  resetError,
  markDirty,
  showSpinner,
);
// function submitForm(appState: AppState): AppState {
//   return markDirty(showSpinner(resetError(appState)));
// }

function resetError(appState: AppState): AppState {
  return {
    ...appState,
    error: "",
  };
}

function showSpinner(appState: AppState): AppState {
  return {
    ...appState,
    shouldShowSpinner: true,
  };
}

function markDirty(appState: AppState): AppState {
  return {
    ...appState,
    submittedBefore: true,
  };
}

// 4. Write a composed/piped version of updatePlayer
type Vector2D = { x: number, y: number };

type Player = {
  position: Vector2D;
  velocity: Vector2D;
};

const accelaration = 2;
const maxVelocity = 10;

function updatePlayer(player: Player, inputData: Vector2D): Player {
  const newDirection = normalizeVector(inputData);
  const destination = scaleVector(newDirection, maxVelocity);
  const updatedVelocity = moveTowards(player.velocity, destination, accelaration);

  return _.pipe(
    player,
    (player) => updateVelocity(player, updatedVelocity),
    (player) => updatePosition(player, addVectors(player.position, updatedVelocity)),
  );

  // return updatePosition(updateVelocity(player, updatedVelocity), addVectors(player.position, updatedVelocity));
}

function updateVelocity(player: Player, velocity: Vector2D): Player {
  return {
    ...player,
    velocity,
  }
}

function updatePosition(player: Player, position: Vector2D): Player {
  return {
    ...player,
    position,
  };
}

function vectorLength(vector: Vector2D) {
  return Math.sqrt(vector.x ** 2 + vector.y ** 2);
}

function scaleVector(vector: Vector2D, by: number): Vector2D {
  return {
    x: vector.x * by,
    y: vector.y * by
  };
}

function normalizeVector(vector: Vector2D): Vector2D {
  const length = vectorLength(vector);

  return scaleVector(vector, 1 / length);
}

function moveTowards(vector: Vector2D, destination: Vector2D, step: number): Vector2D {
  return {
    x: vector.x > destination.x ? Math.max(vector.x - step, destination.x) : Math.min(vector.x + step, destination.x),
    y: vector.y > destination.y ? Math.max(vector.y - step, destination.y) : Math.min(vector.y + step, destination.y)
  };
}

function addVectors(vector1: Vector2D, vector2: Vector2D): Vector2D {
  return {
    x: vector1.x + vector2.x,
    y: vector1.y + vector2.y
  };
}
