// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */

/***************************************
 * CPSC473 Section 1 - Assignment 5
 * Eric Donaldson + Kyle Meyerhardt
 * Serverside-managed game of Rock, Paper, Scissors, Lizard, Spock
 * Sources: Assignment 1 nudge submission, https://gist.github.com/Zaephor/485b52c7ae860ed922bb, Assignment 3 submission, Mozzila Development Network
 ***************************************
 */

"use strict";

var score = {"wins": 0, "losses": 0, "ties": 0};
var lastOutcome = "none";
var options = {
    "rock": ["lizard", "scissors"],
    "paper": ["rock", "spock"],
    "scissors": ["paper", "lizard"],
    "lizard": ["paper", "spock"],
    "spock": ["rock", "scissors"]
};

function playTurn(userPlayed) {
    var randomNumber = Math.floor(Math.random() * Object.keys(options).length);
    var computerPlayed = Object.keys(options)[randomNumber];
    if (userPlayed === computerPlayed) {
        score.ties++;
        return "tie";
    } else if (options[userPlayed].indexOf(computerPlayed) > -1) {
        score.wins++;
        return "win";
    } else if (options[computerPlayed].indexOf(userPlayed) > -1) {
        score.losses++;
        return "lose";
    } else {
        return "failed";
    }
}

function outputResults(res) {
    var temporary = score;
    temporary.outcome = lastOutcome;
    res.write(JSON.stringify(temporary));
    res.end();
}

function invalidRequest(res) {
    res.write("{\"error\":\"Invalid request\"}");
    res.end();
}

function runRPSSL(req, res) {
    var uriPattern = new RegExp(/\/(play)\/(.*)/);
    var uriMatch = req.url.match(uriPattern); // break up the URI via regex

    /* Cue overly complex if statement meant to reduce the number of `if` or `switch` statements */
    if (req.method === "POST" && uriMatch !== null && uriMatch.length === 3 && uriMatch[1] === "play" && typeof options[uriMatch[2].toLowerCase()] !== "undefined") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        lastOutcome = playTurn(uriMatch[2].toLowerCase());
        outputResults(res);
    } else {
        invalidRequest(res); // Error, invalid request
    }
}

var http = require("http");
var server = http.createServer(runRPSSL);
server.listen(9000, "0.0.0.0");
console.log(server);
//var address = server.address();
//console.log("rpssl is listening at http://localhost:" + address.port + "/");
