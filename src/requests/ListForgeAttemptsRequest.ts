import { ListRequest } from './ListRequest';

export class ListForgeAttemptsRequest extends ListRequest {
  guesser?: string;
  order?: string;
}
