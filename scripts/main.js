var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};

var keywordsRequest = $.ajax({
  url: "http://www.cpd.utoronto.ca/wp-json/cpdprograms/v1/keywords",
  method: "GET",
  dataType: "json"
});


keywordsRequest.done(function( keywordsList ) {
    $(".simple-keywords-list").select2({
        data: keywordsList
    });

    $(".simple-keywords-list").on('select2:select', function (evt) {
        // console.log(evt.params.data.text);
        var selectedText = evt.params.data.text;
        var reviewLocation = $('#cpd-keywords-selected').val();

        $('#cpd-keywords-selected').val(reviewLocation+selectedText+'\n');
    });

});

var evmsRequest = $.ajax({
  url: "http://eventsapi.cpdtoronto.ca/api/2/events/",
  method: "GET",
  dataType: "json"
});
evmsRequest.done(function( evmsEvents ) {
    var evmsSelect = [];

    $.each(evmsEvents, function (index, item) {
        var event = {
            id: item.code,
            text: item.name
        }
        evmsSelect.push(event);
    });

    $(".evms-events").select2({
        data: evmsSelect,
        allowClear: false
    });

    $(".evms-events").on('select2:select', function (evt) {
        var selectedEventID = evt.params.data.id;
        console.log(selectedEventID);

        $.ajax({
          url: "http://eventsapi.cpdtoronto.ca/api/2/event/"+selectedEventID,
          method: "GET",
          dataType: "json",
          success: function(result) {
              var eventKeywords = result[0].keywords;
              var newList = eventKeywords.join("\n");
              var reviewLocation = $('#cpd-keywords-selected').val();

              $('#cpd-keywords-selected').val(reviewLocation+newList+'\n');

          }
        });

    });

});

$('#createDestiny').click(function(e){
    e.preventDefault();
    var keywordsEditor = $('#cpd-keywords-selected').val().trim();
    var keywordsRaw = keywordsEditor.split("\n");
    var keywordsUnique = [];
    $.each(keywordsRaw, function(i, el){
        if($.inArray(el, keywordsUnique) === -1) keywordsUnique.push(el);
    });

    var finalListforDestiny = "'" + keywordsUnique.join("';'") + "'";;

    $('#cpd-keywords-for-d1').val('<!--'+finalListforDestiny+'-->');


});
