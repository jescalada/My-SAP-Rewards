var userId = getUserId();

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
        $("#current-points").text(data.points);
        $("#desired-points").text(data.desired_reward_cost);
        move(Math.min(Math.floor((data.points / data.desired_reward_cost) * 100), 100));
        data.rewards_pending.forEach(async (reward, index) => {
            let date = new Date(reward.redeem_date)
            let dateTime = date.toString().split(" ")
            let element = `
                <div class="order" id="order-${index + 1}" style="text-align: center">
                    <h3>${reward.reward_name}</h3>
                    <h2>${dateTime[1] + " " + dateTime[2] + ", " + dateTime[3]}</h2>
                    <p class="details">${reward.reward_desc}</p>
                </div>`;
            $("#pending-rewards").append(element);
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
            let canRedeem = reward.reward_cost <= getPoints();
            let element = `
                <div class="w-full inline-flex rounded-md justify-center" role="group">
                    <button type="button" 
                        class="w-full py-2 px-4 text-sm font-medium text-white bg-blue-700 rounded-l-lg border cursor-default border-gray-900 ">
                        ${reward.reward_cost}
                    </button>
                    <button type="button"
                        class="w-full py-2 px-4 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-900  dark:border-white dark:text-white cursor-default">
                        ${reward.reward_name}
                    </button>
                    <button type="button" onclick="${canRedeem ?
                        "redeem('" + reward.reward_name + "', " + reward.reward_cost + ')' :
                        "select('" + reward.reward_name + "', " + reward.reward_cost + ')'}"
                        class="w-full py-2 px-4 text-sm font-medium text-gray-900 bg-green-400 rounded-r-md border border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                        ${canRedeem ? "Redeem" : "Select"}
                    </button>
                </div>`;

            $("#reward-box").append(element);
        });
    });
}

async function loadDashboard() {
    await loadPoints();
    await loadRewards();
}

loadDashboard();

function move(percentage) {
    var elem = document.getElementById("myBar");   
    var width = 20;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= percentage) {
        clearInterval(id);
      } else {
        width++; 
        elem.style.width = width + '%'; 
        elem.innerHTML = width * 1  + '%';
    }
  }
}

async function redeem(rewardName, rewardCost) {
    let data = {
        userId: userId,
        rewardName: rewardName,
        rewardCost: rewardCost
    }

    fetch('/redeem', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(response => response.json()).then(async (data) => {
        console.log(data);
    });
}

async function select(rewardName, rewardCost) {
    let data = {
        userId: userId,
        rewardName: rewardName,
        rewardCost: rewardCost
    }

    fetch('/select', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(response => response.json()).then(async (data) => {
        console.log(data);
    });
}