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
    const updatedVelocity = _.pipe(
        inputData,
        normalizeVector,
        scaleVector(maxVelocity),
        moveTowards(player.velocity, accelaration),
    );

    return _.pipe(
        player,
        updateVelocity(updatedVelocity),
        updatePosition,
    );
}

function vectorLength(vector: Vector2D) {
    return Math.sqrt(vector.x ** 2 + vector.y ** 2);
}

const scaleVector = (by: number) => (vector: Vector2D): Vector2D => ({
    x: vector.x * by,
    y: vector.y * by
});

function normalizeVector(vector: Vector2D): Vector2D {
    const length = vectorLength(vector);

    return scaleVector(1 / length)(vector);
}

const moveTowards = (destination: Vector2D, step: number) => (vector: Vector2D): Vector2D => ({
    x: vector.x > destination.x ? Math.max(vector.x - step, destination.x) : Math.min(vector.x + step, destination.x),
    y: vector.y > destination.y ? Math.max(vector.y - step, destination.y) : Math.min(vector.y + step, destination.y)
});

function addVectors(vector1: Vector2D, vector2: Vector2D): Vector2D {
    return {
        x: vector1.x + vector2.x,
        y: vector1.y + vector2.y
    };
};

const updateVelocity = (velocity: Vector2D) => (player: Player): Player => ({
    ...player,
    velocity,
});

function updatePosition(player: Player): Player {
    return {
        ...player,
        position: addVectors(player.position, player.velocity),
    };
}

// Build your own mini validation library!
// Implement all the missing validators
type Validator = (value: unknown) => boolean;

export const isAnything = (_: unknown) => true;
export const isString = (value: unknown) => typeof value === "string";
export const isNumber = (value: unknown) => typeof value === "number";
export const isBoolean = (value: unknown) => typeof value === "boolean";
export const either = (...validators: Validator[]) => (value: unknown) => validators.some((validator) => validator(value));
export const isPrimitive = either(isString, isNumber, isBoolean);
export const isArrayOf = (validator: Validator) => (value: unknown) => Array.isArray(value) && value.every(validator);
export const hasShape = (validators: Record<PropertyKey, Validator>) => (value: unknown) =>
    typeof value === "object" &&
    value &&
    Object.entries(validators).every(([key, validator]) => validator(value[key as keyof typeof value])) &&
    Object.entries(value).every(([key, value]) => key in validators && validators[key](value));
export const optionally = (validator: Validator) => (value: unknown) => value == null || validator(value);
