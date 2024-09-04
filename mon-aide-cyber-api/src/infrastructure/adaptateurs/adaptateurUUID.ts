import crypto from 'crypto';

const genereUUID = () => crypto.randomUUID();

export const adaptateurUUID = { genereUUID: () => genereUUID() };
