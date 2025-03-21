export async function uploadACHFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
    });

    return response.json();
}
