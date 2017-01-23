'use strict';

import QVote from '../models/qvote';

function insertQVote (vote) {
 var theVote=vote;
 if(!this.synuser  && this.synuser.id) return; // can't vote if your not a users (and don't cause an error if you try)
 theVote.user=this.synuser.id; // on the server side we add the userId.
  QVote
    .create(theVote)
    .then(() => {})
    .catch(this.error.bind(this))
}

export default insertQVote;
