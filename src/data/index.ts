import { MockMoversRepository } from './MockMoversRepository';
import type { MoversRepository } from './MoversRepository';

// Switch to ApiMoversRepository here once the backend exists.
export const moversRepository: MoversRepository = new MockMoversRepository();
