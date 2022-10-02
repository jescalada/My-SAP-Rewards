async function loadDate(dateNumber) {
    let data = {
        dateNumber: dateNumber,
        location: "SAP Labs Vancouver",
    }

    fetch('/loaddate', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(response => response.json()).then(async (data) => {
        console.log(data);
    })
}

$(".date").on( "click", function() {
    await loadDate($(this).text().trim());
  });