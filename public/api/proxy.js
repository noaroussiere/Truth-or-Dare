export default async function handler(req, res) {
    const backendUrl = "http://api_js:8080/api/data";

    try {
        const response = await fetch(backendUrl, {
            method: req.method,
            headers: {
                "Content-Type": "application/json",
            },
            body: req.method === "GET" ? null : JSON.stringify(req.body),
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: "Erreur de communication avec le backend" });
    }
}
