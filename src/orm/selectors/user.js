import { createSimpleSelector } from 'orm';

export const accounts = createSimpleSelector('User', ['ref']);
