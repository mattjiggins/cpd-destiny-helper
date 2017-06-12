var eventsURI = 'http://eventsapi.cpdtoronto.ca/api/2/events/';
var keywordsURI =  'http://www.cpd.utoronto.ca/wp-json/cpdprograms/v1/keywords';

Vue.component('v-select', VueSelect.VueSelect);

function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}


var app = new Vue({
    el: '#app-cpd-d1-keywords-helper',
    data: function () {
        return {
            keywordSelect: '',
            eventSelect: '',
            keywordComposer: '',
            keywordOptions: [],
            eventsOptions: [],
            eventKeywordsArray: [],
            eventKeywords: "",
        }
    },

    computed: {
        destinyResult: function() {
            var keywordStaging = this.keywordComposer.trim().split("\n"),
                uniqueKeywords = uniq_fast(keywordStaging.sort()),
                finalListforDestiny = "'" + uniqueKeywords.join("';'") + "'";;
            return '<!--'+finalListforDestiny+'-->';
        }
    },

    methods: {
        clearComposer: function () {
            this.keywordComposer = "";
        },
        showKeywordVideo: function() {
            var keywordHelper = document.getElementById("keywords-helper-video");
            var buttonShowKeywordHelper = document.getElementById("keywords-helper-info");
            if (buttonShowKeywordHelper.innerHTML == "Close") {
                buttonShowKeywordHelper.innerHTML = "Help/Information";
                keywordHelper.className = " visually-hidden";
            } else {
                buttonShowKeywordHelper.innerHTML = "Close";
                keywordHelper.className = "";
            }
        },
        keywordChange: function(val) {
            if ((val != "") && (val != null)) {
                this.keywordComposer = this.keywordComposer+val+"\n";
            }
        },
        eventChange: function(val) {
            if (val != null) {
                var eventKeywordsArray = val.value;
                if ( eventKeywordsArray != undefined) {
                    var eventKeywords = eventKeywordsArray.join("\n");
                    this.keywordComposer = this.keywordComposer+eventKeywords+"\n";
                }
            }

        }
    },

    mounted: function () {
        var self = this;
        // Keywords
        axios.get(keywordsURI)
            .then(function (response) {
                var keywords = response.data,
                    keywordsArray = [];

                keywords.forEach(function(keyword) {
                    keywordsArray.push(keyword.id);
                });

                self.keywordOptions = keywordsArray;
            })
            .catch(function (error) {
                console.log(error);
            });

        // Events
        axios.get(eventsURI)
            .then(function (response) {
                var events = response.data,
                    eventsArray = [];
                events.forEach(function(event){
                    eventsArray.push({
                        "label": event.code+" - "+event.name,
                        "value": event.keywords
                    })
                });
                self.eventsOptions = eventsArray;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

})
