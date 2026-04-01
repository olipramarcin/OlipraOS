const input = document.getElementById('input');
const output = document.getElementById('output');

document.getElementById('submit').addEventListener('click', () => {
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
});

input.addEventListener('keydown', async (e) => {
    if (e.key !== 'Enter') return;

    const command = input.value.trim();
    if (!command) return;
    input.value = '';

    const cmdLine = document.createElement('span');
    cmdLine.className = 'terminal-line';
    cmdLine.style.color = output.dataset.color || "rgb(81,255,0)";
    cmdLine.innerHTML = `> ${command}<br>`;
    output.appendChild(cmdLine);

    const response = await fetch('/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cmd: command })
    });
    const data = await response.json();

    if (data.clear) {
        output.innerHTML = "OlipraOS Terminal v0.1 <br>Type 'help' to start.<br>";
        output.dataset.color = "rgb(81,255,0)";
    } else if (data.result.startsWith("<color:")) {
        const match = data.result.match(/<color:(.+?)>/);
        if (match) {
            const color = match[1];
            output.dataset.color = color === 'reset' ? "rgb(81,255,0)" : color;
            // reszta tekstu po <color:…> wyświetlamy w tym kolorze
            const textAfter = data.result.replace(match[0], '');
            const line = document.createElement('span');
            line.className = 'terminal-line';
            line.style.color = output.dataset.color;
            line.innerHTML = textAfter + '<br>';
            output.appendChild(line);
        }
    } else {
        const line = document.createElement('span');
        line.className = 'terminal-line';
        line.style.color = output.dataset.color || "rgb(81,255,0)";
        line.innerHTML = data.result.replace(/\n/g,'<br>') + '<br>';
        output.appendChild(line);
    }

    output.scrollTop = output.scrollHeight;
});