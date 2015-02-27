// call the chuck norris API
var getQuote = function(callback) {
  // perform AJAX request to quotes api
  $.ajax({
    url: 'http://api.icndb.com/jokes/random',
    type: 'GET',
    success: function(response) {
      var quote = response.value.joke;
      callback(quote);
      // $('#quotes').append('<li><span class="voteCount">(0) </span>' + quote + '</li>');
    },
    error: function() {
      console.log('quote not retrieved');
    },
    dataType: "jsonp"
  });
};

// on button click, load new chuck norris quote
// $('#quoteButton').click(function(){
//   getQuote();
// });








