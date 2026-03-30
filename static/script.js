const input = document.getElementById('input');
        const output = document.getElementById('output');

        input.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                const command = input.value;
                output.textContent += `> ${command}\n`;
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
                output.textContent += data.result + '\n';
                output.scrollTop = output.scrollHeight;
                }
            });