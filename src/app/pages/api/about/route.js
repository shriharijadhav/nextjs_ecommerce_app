export default function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json({ message: "hi bitch" });
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
