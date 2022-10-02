var userId = getUserId();
var isAdmin = isAdmin();

const d = new Date();
document.getElementById("demo").innerHTML = d.toDateString();

async function loadProfile() {
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
        console.log(data);
                $("#username").text(data.full_name);
                $("#username2").text(data.full_name);
                $("#username3").text(data.full_name);
                $("#current-points").text(data.points);
                $("#needed-points").text(data.desired_reward_cost);
                $("#avatar").attr("src", data.profile_img_url);
                let percentage = Math.min(Math.floor((data.points / data.desired_reward_cost) * 100), 100)
                move(percentage);

            data.rewards_pending.forEach(async (reward, index) => {
                console.log(reward);
                
                let date = new Date(reward.redeem_date)
                let dateTime = date.toString().split(" ")
                let element = `
                    <div class="order" id="order-${index + 1}" style="text-align: center">
                        <h3>${reward.reward_name}</h3>
                        <img src="${reward.reward_img_url}" class="reward-img">
                        <p class="details">${reward.reward_desc}</p>
                    </div>`;
                $("#pending-rewards").append(element);
            });
        });
}

async function loadTimeline() {
    try {
        const timeline = await $.get(`/timeline/${userId}`, function (timeline, status) {});
        return timeline;
    } catch {
        return null;
    }
}

async function loadTimelineHandler() {
    const timeline = await loadTimeline()
    $("#timeline").empty();
    let text = ""
    timeline.forEach(object => {
        entry = object.entry
        let timeData = new Date(entry.timestamp).toString().split("GMT")
        text += `<li>Query: ${entry.query}<br>${timeData[0]}</li>`
    });
    $("#timeline").append(text);
}

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

loadProfile();