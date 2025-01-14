async function getRecentPost() {
    const response = await fetch("https://queue.hbllmakerspace.click/recent");
    const recent = await response.json();
    document.getElementById("recent").replaceWith(createTableFromJSON(JSON.stringify(recent)));
}

function createTableFromJSON(jsonData) {
    // Parse the JSON if it's a string
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    // Create table element
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '30%';
    
    // Helper function to flatten nested objects and remove prefixes
    function flattenObject(obj, prefix = '') {
        let flattened = {};
        
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                const nested = flattenObject(value);  // Remove prefix parameter
                flattened = { ...flattened, ...nested };
            } else {
                // Remove any prefix when adding to flattened object
                const finalKey = prefix ? `${prefix}${key}` : key;
                flattened[finalKey] = value;
            }
        }
        
        return flattened;
    }
    
    // Flatten the data structure
    const flatData = flattenObject(data);
    
    // Create table rows
    for (const [key, value] of Object.entries(flatData)) {
        // Skip the 'body' property itself
        if (key === 'body') continue;
        
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #ddd';
        
        // Create header cell
        const header = document.createElement('th');
        // Capitalize first letter and add spaces before other capital letters
        header.textContent = key.charAt(0).toUpperCase() + 
                           key.slice(1).replace(/([A-Z])/g, ' $1');
        header.style.textAlign = 'left';
        header.style.padding = '12px';
        header.style.backgroundColor = '#f5f5f5';
        header.style.width = '30%';
        
        // Create data cell
        const cell = document.createElement('td');
        cell.style.padding = '12px';
        
        // Format the value based on its type
        if (Array.isArray(value)) {
            cell.innerHTML = value.join('<br>');
        } else if (value instanceof Date) {
            cell.textContent = value.toLocaleString();
        } else {
            cell.textContent = value;
        }
        
        // Add cells to row
        row.appendChild(header);
        row.appendChild(cell);
        
        // Add row to table
        table.appendChild(row);
    }
    
    return table;
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