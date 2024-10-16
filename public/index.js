async function getRecentPost() {
    const response = await fetch("https://queue.hbllmakerspace.click/recent");
    const recent = await response.json();
    document.getElementById("recent").innerText = JSON.stringify(recent);
}

function getBoxCreds() {
    //window.location.href = "https://account.box.com/api/oauth2/authorize?client_id=253clye8usq2vhvqna7ro45g9tr1kzgg&redirect_uri=http://localhost:3000/box&response_type=code";
    window.location.href = "https://account.box.com/api/oauth2/authorize?client_id=253clye8usq2vhvqna7ro45g9tr1kzgg&redirect_uri=https://queue.hbllmakerspace.click/box&response_type=code";
}

function getGapiCreds() {
    window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fspreadsheets%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive&prompt=consent&response_type=code&client_id=728722216476-btqq00onmlhon8cbnagen4qqb51qg6ih.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fqueue.hbllmakerspace.click%2Fgapi";
    //window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fspreadsheets%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive&response_type=code&client_id=728722216476-btqq00onmlhon8cbnagen4qqb51qg6ih.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fgapi";
}

setInterval(getRecentPost, 1000);