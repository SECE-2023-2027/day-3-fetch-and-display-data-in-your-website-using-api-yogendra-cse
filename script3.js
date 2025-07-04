async function getId() {
    const idInput = document.getElementById('idn').value.trim();
    const datasDiv = document.getElementById('datas');
    datasDiv.innerHTML = '';
    
    if (!idInput) {
        datasDiv.innerHTML = '<p>Please enter a user ID or range.</p>';
        return;
    }

    let ids = [];
    if (idInput.includes('-')) {
        const [start, end] = idInput.split('-').map(Number);
        if (isNaN(start) || isNaN(end) || start > end) {
            datasDiv.innerHTML = '<p>Invalid range.</p>';
            return;
        }
        for (let i = start; i <= end; i++) ids.push(i);
    } else {
        const id = Number(idInput);
        if (isNaN(id)) {
            datasDiv.innerHTML = '<p>Invalid ID.</p>';
            return;
        }
        ids.push(id);
    }

    let users = [];
    for (let id of ids) {
        try {
            const res = await fetch(`https://dummyjson.com/users/${id}`);
            if (!res.ok) continue;
            const data = await res.json();

            // Map required fields
            const user = {
                id: data.id,
                name: `${data.firstName} ${data.lastName}`,
                username: data.username,
                email: data.email,
                phone: data.phone,
                website: data.domain || 'N/A'
            };

            users.push(user);
        } catch (err) {
            console.error(`Error fetching user ${id}:`, err);
        }
    }

    if (users.length === 0) {
        datasDiv.innerHTML = '<p>No user data found.</p>';
        return;
    }

    let table = `<table border="1" cellpadding="5">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Website</th>
            </tr>
        </thead>
        <tbody>`;

    users.forEach(user => {
        table += `<tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.website}</td>
        </tr>`;
    });

    table += '</tbody></table>';
    datasDiv.innerHTML = table;
}
