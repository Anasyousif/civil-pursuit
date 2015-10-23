'use strict';

import Mungo       from 'mungo';
import V1         from './migrations/1';
import V2         from './migrations/2';

class PoliticalParty extends Mungo.Model {
  static schema () {
    return {
      "name" : String
    };
  }
}

PoliticalParty.migrations = {
  1 : V1,
  2 : V2
};

PoliticalParty.version = 2;

PoliticalParty.collection = 'political_parties';

export default PoliticalParty;
