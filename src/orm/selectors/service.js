import { createSimpleSelector } from 'orm';

export const services = createSimpleSelector('Service', ['ref']);
