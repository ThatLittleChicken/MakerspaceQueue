async function getRecentPost() {
    const response = await fetch("https://queue.hbllmakerspace.click/recent");
    const recent = await response.json();
    document.getElementById("recent").innerText = JSON.stringify(recent);
}

async function getBoxCreds() {
    window.location.href = "https://account.box.com/api/oauth2/authorize?client_id=253clye8usq2vhvqna7ro45g9tr1kzgg&redirect_uri=https://queue.hbllmakerspace.click/box&response_type=code";
}

setInterval(getRecentPost(),1000);