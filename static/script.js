const input = document.getElementById('input');
document.getElementById('submit').addEventListener('click', () => {
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
});
        const output = document.getElementById('output');

        input.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                const command = input.value;
                output.innerHTML += `> ${command}\n`;
                input.value = '';

                // Send commands to backend
                const response = await fetch('/command', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ cmd: command })
                });
                const data = await response.json();

                if (data.clear) {
                    output.innerHTML = "OlipraOS Terminal v0.1 <br>Type 'help' to start.";
                } else {
                output.innerHTML += data.result + '\n';
                output.scrollTop = output.scrollHeight;
                }
                }
            });