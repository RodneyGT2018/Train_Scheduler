$(document).ready(function () {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBfTnpnTWYXaJKFhL9RMYeFB81vzqj24YM",
    authDomain: "rrs-trainscheduler.firebaseapp.com",
    databaseURL: "https://rrs-trainscheduler.firebaseio.com",
    projectId: "rrs-trainscheduler",
    storageBucket: "",
    messagingSenderId: "112635425877"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // Capture Button Click info
  $("#add-train").on("click", function(event) {
    event.preventDefault();

    // Get the values from text boxes
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#first-train").val().trim();
    var freq = $("#interval").val().trim();

    // Push the data to firebase
    database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: freq
    });
  });


  // Firebase watcher + initial loader
  database.ref().on("child_added", function(childSnapshot) {

    var newTrain = childSnapshot.val().trainName;
    var newLocation = childSnapshot.val().destination;
    var newFirstTrain = childSnapshot.val().firstTrain;
    var newFreq = childSnapshot.val().frequency;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(startTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % newFreq;

    // Minute(s) Until Train
    var tMinutesTillTrain = newFreq - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var catchTrain = moment(nextTrain).format("HH:mm");

    // Display On Page with a little ES6 syntax
    $("#all-display").append(
      '<tr><td>' + newTrain +
      '</td><td>' + newLocation +
      '</td><td>' + newFreq +
      '</td><td>' + catchTrain +
      '</td><td>' + tMinutesTillTrain + '</td></tr>');

    // Clear input fields
    $("#train-name, #destination, #first-train, #interval").val("");
    return false;
  },
    //Controle Log errors
    function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

});