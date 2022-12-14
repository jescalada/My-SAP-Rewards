let userId = getUserId();
let currentDay = 1;
let fullName = getFullName();

async function loadDate(dateNumber) {
    currentDay = dateNumber;

    let data = {
        dateNumber: dateNumber,
        location: "SAP Canada Inc.",
    }

    fetch('/loaddate', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(response => response.json()).then(async (data) => {
        $("#day-number").text(dateNumber);
        $("#day-number1").text("0" + dateNumber);

        if (!data.users) {
            $("#attendees-box").empty();
            $("#day-status").text("Remote");
            return;
        }

        $("#attendees-box").empty();
        $("#day-status").text("Remote");

        data.users.forEach(user => {
            let element = `
                <div class="border-b pb-4 border-gray-400 border-dashed">
                    <p class="text-xs font-light leading-3 text-gray-500 dark:text-gray-300">${user.schedule_time}</p>
                    <a tabindex="0" class="focus:outline-none text-lg font-medium leading-5 text-gray-800 dark:text-gray-100 mt-2">${user.full_name}</a>
                </div>
            `;
            if (user.user_id == userId) {        
                $("#day-status").text("In-Person");
            }
            $("#attendees-box").append(element);
        });
    })
}

async function setInPerson() {
    $(`#day-${currentDay}`).addClass("bg-green-700");
    $(`#day-${currentDay}`).removeClass("bg-red-700");
    let element = `
                <div class="border-b pb-4 border-gray-400 border-dashed">
                    <p class="text-xs font-light leading-3 text-gray-500 dark:text-gray-300">9:00AM - 5:30PM</p>
                    <a tabindex="0" class="focus:outline-none text-lg font-medium leading-5 text-gray-800 dark:text-gray-100 mt-2">${fullName}</a>
                </div>
            `;
    $("#attendees-box").append(element);
    $("#day-status").text("In-Person");
}

async function setRemote() {
    $(`#day-${currentDay}`).addClass("bg-red-700");
    $(`#day-${currentDay}`).removeClass("bg-green-700");
    $("#day-status").text("Remote");
    // todo update list
}

async function setUndecided() {
    console.log("Undecided triggered")
}

$(".date").on( "click", function() {
    loadDate($(this).text().trim());
  });