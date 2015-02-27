var LEADERBOARD_SIZE = 10;
var counter = 0;

// Create our Firebase reference
var scoreListRef = new Firebase('https://amber-heat-4078.firebaseio.com/');

var htmlForPath = {};

function handleScoreAdded(scoreSnapshot, prevScoreName) {
  var newScoreRow = $("<tr/>");

  newScoreRow.append($("<td/>").append($("<span/>").text(scoreSnapshot.val().quote)));
  newScoreRow.append($("<td/>").text(scoreSnapshot.val().score));
  newScoreRow.click(function () {
    var chuck = scoreSnapshot.val();
    var userScoreRef = scoreListRef.child(chuck.quote);
    chuck.score++;
    userScoreRef.update({ score: chuck.score });
  });

  // Store a reference to the table row so we can get it again later.
  htmlForPath[scoreSnapshot.key()] = newScoreRow;

  // Insert the new score in the appropriate place in the table.
  if (prevScoreName === null) {
    $("#leaderboardTable").append(newScoreRow);
  }
  else {
    var lowerScoreRow = htmlForPath[prevScoreName];
    lowerScoreRow.before(newScoreRow);
  }
}

// Helper function to handle a score object being removed; just removes the corresponding table row.
function handleScoreRemoved(scoreSnapshot) {
  var removedScoreRow = htmlForPath[scoreSnapshot.key()];
  removedScoreRow.remove();
  delete htmlForPath[scoreSnapshot.key()];
}

// Create a view to only receive callbacks for the last LEADERBOARD_SIZE scores
var scoreListView = scoreListRef.limitToLast(LEADERBOARD_SIZE);

// Add a callback to handle when a new score is added.
scoreListView.orderByChild("score").on('child_added', function (newScoreSnapshot, prevScoreName) {
  handleScoreAdded(newScoreSnapshot, prevScoreName);
});

// Add a callback to handle when a score is removed
scoreListView.orderByChild("score").on('child_removed', function (oldScoreSnapshot) {
  handleScoreRemoved(oldScoreSnapshot);
});

// Add a callback to handle when a score changes or moves positions.
var changedCallback = function (scoreSnapshot, prevScoreName) {
  handleScoreRemoved(scoreSnapshot);
  handleScoreAdded(scoreSnapshot, prevScoreName);
};
scoreListView.orderByChild("score").on('child_moved', changedCallback);
scoreListView.orderByChild("score").on('child_changed', changedCallback);

// When the user adds a new quote, add the score, and update the highest score.
$("#quoteButton").click(function () {
  getQuote(function(quote) {
    quote = quote.split('.').join(',');
    var userScoreRef = scoreListRef.child(quote);
    userScoreRef.set({ quote: quote, score: 0 });
  });
});
