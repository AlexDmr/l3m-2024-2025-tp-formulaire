import * as zod from 'zod';

export interface Adress {
    readonly label: string;
    readonly score: number;
    readonly id: string;
    readonly type: string;
    readonly postcode: string;
    readonly citycode: string;
    readonly x: number;
    readonly y: number;
    readonly city: string;
}

const adressSchema = zod.object({
    label: zod.string(),
    score: zod.number(),
    id: zod.string(),
    type: zod.string(),
    postcode: zod.string(),
    citycode: zod.string(),
    x: zod.number(),
    y: zod.number(),
    city: zod.string(),
}).readonly();

export function parseAdress(obj: unknown): Promise<Adress> {
    return adressSchema.parseAsync(obj);
}