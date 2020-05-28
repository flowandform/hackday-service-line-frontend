import { createSimpleSelector } from 'orm';

export const accounts = createSimpleSelector('Service', ['ref']);
