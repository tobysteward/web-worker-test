var postMessage;
var XMLHttpRequest;

var handlers = {
    getCountryTlds: function (data) {
        "use strict";

        var output = data.map(function (country) {
            return {
                name: country.name,
                tld: country.topLevelDomain
            };
        });

        return output;
    },
    getCountriesWithPopulation: function (data) {
        "use strict";

        var output = data.filter(function (country) {
            if (country.population <= 10000000) {
                return false;
            }

            return true;
        }).map(function (country) {
            return {
                name: country.name,
                population: parseInt(country.population, 10)
            };
        });

        output.sort(function (a, b) {
            return a.population - b.population;
        }).reverse();

        return output;
    }
};

var load = function (url, cb) {
    "use strict";

    if (XMLHttpRequest === "undefined") {
        return false;
    }

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState < 4) {
            return;
        }

        if (xhr.status !== 200) {
            return;
        }

        if (xhr.readyState === 4) {
            cb(xhr);
        }
    };

    xhr.open("GET", url, true);
    xhr.send();
};

var onmessage = function (e) {
    "use strict";

    load("https://restcountries.eu/rest/v1/all", function (response) {
        postMessage(handlers[e.data](JSON.parse(response.responseText)));
    });
};
