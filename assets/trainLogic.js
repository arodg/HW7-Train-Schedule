// 1. Initialize Firebase
// 2. Capture new train data
// 3. Upload train data to database
// 4. Clear text boxes
// 5. Retrieve data from database and populate table
// 6. Perform math calculations on Next Arrival and Minutes Away

// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyA38SbzMkym82A0hKVCEKcNVU4FIY6cLgU",
  authDomain: "train-schedule-ac622.firebaseapp.com",
  databaseURL: "https://train-schedule-ac622.firebaseio.com",
  projectId: "train-schedule-ac622",
  storageBucket: "train-schedule-ac622.appspot.com",
  messagingSenderId: "405154819038"
};

firebase.initializeApp(config);

var database = firebase.database();
console.log(firebase);


// 2. Capture new train data
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrain = moment($("#first-train-input").val().trim(), "HH:mm").format("X");
  var frequency = $("#frequency-input").val().trim();

  var newTrain = {
    name: trainName,
    dest: destination,
    time: firstTrain,
    freq: frequency
  };

  // 3. Upload train data to the database
  database.ref().push(newTrain);


  // 4. Clear text boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});


// 5. Retrieve data from database and populate table
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().dest;
  var firstTrain = childSnapshot.val().time;
  var frequency = childSnapshot.val().freq;

  // 6. Calculate Next Arrival and Minutes Away, based on class exercise #21, Train Predictions

    // First train time (pushed back 1 year to make sure it comes before current time)
    var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
    
    // Current time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");

    // Time apart (remainder)
    var remainder = diffTime % frequency;

    // Minutes until next train
    var minutesAway = frequency - remainder;

    // Time of next arrival
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm");
    

    $(".table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + 
      "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");

});

