from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

fs = {
    "Documents": {"note1.txt": "This is a note.", "note2.txt": "This is another note."},
    "Pictures": {"image1.jpg": "This is an image.", "image2.jpg": "This is another image."},
    "Music": {"song1.mp3": "This is a song.", "song2.mp3": "This is another song."},
    "Downloads": {"file1.zip": "This is a zip file.", "file2.zip": "This is another zip file."}
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/command', methods=['POST'])
def command():
    data = request.get_json()
    cmd = data.get('cmd', '').strip()

    if cmd == 'help':
        result = "Available commands: help, ls, cat <file>"
    elif cmd == 'ls':
        result = " ".join(fs.keys())
    elif cmd.startswith('cat '):
        parts = cmd.split(maxsplit=1)
        if len(parts) < 2 or not parts[1].strip():
            result = "Usage: cat <file> or <folder/file>"
        else:
            path = [p for p in parts[1].split('/') if p]
            if len(path) == 1:
                file_name = path[0]
                file_content = fs.get(file_name, None)
                if file_content is None:
                    result = f"No such file: {file_name}"
                elif isinstance(file_content, dict):
                    result = f"{file_name} is a folder, not a file"
                else:
                    result = file_content
            elif len(path) == 2:
                folder_name, file_name = path
                folder_dict = fs.get(folder_name, None)
                if folder_dict is None or not isinstance(folder_dict, dict):
                    result = f"No such folder: {folder_name}"
                else:
                    file_content = folder_dict.get(file_name)
                    if file_content is None:
                        result = f"No such file: {file_name}"
                    else:
                        result = file_content
            else:
                result = "Path too deep (max folder/file)"
    else:
        result = f"Unknown command: {cmd}"

    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)