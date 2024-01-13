//Coding Steps:
//Create a full CRUD application of your choice using an API or JSON Server.
//Use JQuery/AJAX to interact with the API.
//Use a form to post new entities.
//Build a way for users to update or delete entities.
//Include a way to get entities from the API.
//Use Bootstrap and CSS to style your project.

//The code starts with a console.log( "coffeeapp") statement, which logs the message"coffeeapp" to the console. This is a good way to check that the JavaScript file is linked correctly to the HTML file.
console.log("coffeeapp");

//The "apiendpoint" variable is declared and assigned the value of the API endpoint URL.  This URL represents the location where the coffee data is stored.
let apiendpoint = "https://659cb05f633f9aee7907cf46.mockapi.io/api/2/coffees";

//the "getCoffee" funtion is defined.  This function makes a GET request to the API endpoint to retrieve the coffee data.  It uses the `$.ajax` method from jQuery to send the request.  On success, the response is logged to the console and the `displayCoffees` function is called to render the coffee data in the UI.
function getCoffee() {
  console.log("getting coffee from API...");
  // Get all coffees
  $.ajax({
    url: `${apiendpoint}`,
    method: "GET",
    success: function (response) {
      console.log("coffee response:", response);
      displayCoffees(response);
    },
  });
}
getCoffee();

// The "createCoffee" function is defined.  This function is triggered when a form is submitted (presumably a form for adding a new coffee).  It prevents the default form submission behavior, retrieves the values of the coffee name and quantity from the form inputs, and sends a POST request to the API endpoint with the new coffee data.  On success, the "getCoffee" function is called to refresh the coffee list.
function createCoffee(event) {
  console.log("createCoffee...");
  event.preventDefault();
  let nameValue = $("#coffee-name").val();
  let quantityValue = $("#coffee-quantity").val();

  // Send the new coffee data to the server
  $.ajax({
    url: `${apiendpoint}`,
    method: "POST",
    data: { name: nameValue, quantity: quantityValue },
    success: function (response) {
      // Refresh the coffee list
      getCoffee();
    },
  });
}

// The code sets up an event listener using jQuery's "$(document).on" method.  It listens for clicks on elements with the class "delete-coffee".  When a delete button is clicked, it retrieves the coffee ID from the data attribute of the clicked button and sends a delete request to the API endpoint with the corresponding coffee ID.  On success, the "getCoffee" function is called to refresh the coffee list.
$(document).on("click", ".delete-coffee", function () {
  var coffeeId = $(this).data("id");

  // Send the coffee ID to the server for deletion
  $.ajax({
    url: `${apiendpoint}/${coffeeId}`,
    method: "DELETE",
    success: function (response) {
      // Refresh the coffee list
      getCoffee();
    },
  });
});

// The "displayCoffees" function is defined.  This function takes an array of coffee objects as a parameter.  It clears the existing coffee list in the UI and then iterates over the coffee array in reverse order.  For each coffee, it creates a new div element with a coffee name as the text content.  It also adds a class to the div element based on the coffee name and ID.  Addititionally, it creates a delete button with the text "Delete" and sets the coffee ID as a data attribute.  The delete button is appended to the coffee div element, and teh coffee div element is appended to the coffee list in the UI.
function displayCoffees(coffees) {
  console.log("display coffees...", coffees);
  var coffeeList = $("#coffee-list");
  coffeeList.empty();

  coffees.reverse().forEach(function (coffee) {
    var coffeeItem = $("<div>").text(coffee.name);
    coffeeItem.addClass(`${coffee.name}-id-${coffee.id}`);
    var deleteButton = $("<button>")
      .addClass("delete-coffee")
      .text("Delete")
      .data("id", coffee.id);

    // For each coffe we also want to display a "update" form
    var form = $("<form>")
      .addClass("update-form")
      .text("update me!")
      .data("id", coffee.id);

    // creating elements to go into the form
    var qty = $("<input>").attr("placeholder", "new quantity");
    var name = $("<input>").attr("placeholder", "new name");
    var updateButton = $("<button>")
      .addClass("update-coffee")
      .text("Update")
      .data("id", coffee.id);

    // adding a function that fires on click to the form's button
    updateButton.on("click", function (event) {
      event.preventDefault();
      // send and ajax PUT request to the api, containing the new updated data
      // Send the new coffee data to the server
      $.ajax({
        url: `${apiendpoint}/${coffee.id}`,
        method: "PUT",
        data: { name: name.val(), quantity: Number(qty.val()) },
        success: function (response) {
          // Refresh the coffee list
          getCoffee();
        },
      });
    });

    // putting input and button elements into the form
    form.append(qty);
    form.append(name);
    form.append(updateButton);

    coffeeItem.append(deleteButton);
    coffeeItem.append(form);
    coffeeList.append(coffeeItem);
  });
}
