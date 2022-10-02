async function loadRewards() {

}

async function loadPoints() {
    let data = {
        userId: userId,
    }

    fetch('/thisuser', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(response => response.json()).then(async (data) => {
                data.points;
                data.desired_reward_cost;
                $("#username3").text(data.username);
                $("#username4").text(data.username);
            data.rewards_pending.forEach(async (reward, index) => {
                console.log(reward);
                
                let date = new Date(reward.redeem_date)
                let dateTime = date.toString().split(" ")
                let element = `
                    <div class="order" id="order-${index + 1}" style="text-align: center">
                        <h3>${reward.reward_name}</h3>
                        <h2>${dateTime[1] + " " + dateTime[2] + ", " + dateTime[3]}</h2>
                        <p class="details">${reward.reward_desc}</p>
                    </div>`;
                $("#pending-rewards").append(element);

                /*order[0].cart.forEach(async (pokemon) => {
                    let pokemonData = await getPokemonBasicDataById(pokemon.pokemonId)
                    let entry = `
                    <div class="thumbnail-container" style="text-align: center; display: inline-block">
                        <img src="${pokemonData.sprite}" alt="${pokemonData.name}" style="width:100%"
                            onclick="location.href='pokemon.html?id=${pokemonData.id}'" class="pokemon-image-thumb">
                            <div class="row pokemon-buy-details">
                            <h3 class="col card-price">${pokemonData.name}</h3>
                            <h3 class="col card-price">$${pokemonData.price}</h3>
                            <h3 class="col card-quantity" id="card-quantity-${pokemonData.id}">Qty: ${pokemon.quantity}</h3>
                            <h3 class="col card-total-price"> Total: $${(pokemonData.price * pokemon.quantity).toFixed(2)}</h3>
                        </div>
                    </div>
                    `;
                    $(`#order-${index + 1}`).append(entry);
                })*/
            });
        });
}

async function loadRewards() {
    fetch('/rewardslist', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        }
    }).then(response => response.json()).then(async (data) => {
        data.forEach(reward => {
            let element = `
                <div class="w-full inline-flex rounded-md justify-center" role="group">
                    <button type="button"
                        class="py-2 px-4 text-sm font-medium text-white bg-blue-700 rounded-l-lg border cursor-default border-gray-900 ">
                        ${reward.reward_cost}
                    </button>
                    <button type="button"
                        class=" py-2 px-4 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-900  dark:border-white dark:text-white cursor-default">
                        ${reward.reward_name}
                    </button>
                    <button type="button"
                        class="py-2 px-4 text-sm font-medium text-gray-900 bg-green-400 rounded-r-md border border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                        ${reward.reward_cost > getPoints() ? "Select" : "Redeem"}
                    </button>
                </div>`;

            $("#reward-box").append(element);
        });
    });
}

async function loadDashboard() {
    // await loadPoints();
    await loadRewards();
}

loadDashboard();

function move() {
    var elem = document.getElementById("myBar");   
    var width = 20;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= 90) {
        clearInterval(id);
      } else {
        width++; 
        elem.style.width = width + '%'; 
        elem.innerHTML = width * 1  + '%';
      }
    }
  }
  window.onload = function() {
    move();
  };