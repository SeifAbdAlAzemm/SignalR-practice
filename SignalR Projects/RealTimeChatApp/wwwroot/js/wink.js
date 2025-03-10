document.getElementById("winkButton").addEventListener("click", async function () {
    const winkedUser = document.getElementById("winkUserSelect").value;

    if (!winkedUser) {
        alert("Please select a user to wink at!"); // Ensure user selection
        return;
    }

    try {
        await connection.invoke("SendPrivateMessage", winkedUser, `⚠️ ${username} winks you! 😉`);
        alert(`You winked at ${winkedUser}!`); // Optional feedback
    } catch (err) {
        console.error("Error sending wink:", err);
    }
});
