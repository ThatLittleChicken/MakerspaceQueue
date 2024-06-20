async function getRecentPost() {
    const response = await fetch("http://35.153.196.169/recent");
    const recent = await response.json();
    document.getElementById("recent").innerText = JSON.stringify(recent);
}

getRecentPost();