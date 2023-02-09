// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
    // Get page-url from query
    const { url } = req.query;

    // Fetch page-data
    const page = await fetch(url)
        .then((res) => res.text())
        .then((data) => data);

    res.status(200).json({ url, page });
}
