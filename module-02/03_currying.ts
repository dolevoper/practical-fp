import * as _ from "remeda";

// Refactor updatePlayer
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

    return {
        ...player,
        velocity: updatedVelocity,
        position: addVectors(player.position, updatedVelocity)
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


// Build your own mini validation library!
// Implement all the missing validators
type Validator = (value: unknown) => boolean;

export const isAnything = (value: unknown) => true;
export const isString = isAnything;
export const isNumber = isAnything;
export const isBoolean = isAnything;
export const either = (...validators: Validator[]) => isAnything;
export const isPrimitive = isAnything;
export const isArrayOf = (validator: Validator) => isAnything;
export const hasShape = (validators: Record<PropertyKey, Validator>) => isAnything;
export const optionally = (validator: Validator) => isAnything;
