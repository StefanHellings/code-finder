import { useState } from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';

const Home = () => {
    const [code, setCode] = useState('');
    const [urls, setUrls] = useState('');
    const [results, setResults] = useState([]);
    const [notFound, setNotFound] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);

        const pages = urls
            .split('\n')
            .filter((url) => url !== '');

        pages.forEach(async (url) => {
            const res = await fetch(`api/page-data?url=${url}`);
            const data = await res.json();
            const page = data.page;
            const matches = page.match(new RegExp(code, 'g'));
            const timesFound = matches ? matches.length : 0;

            if (matches)
                setResults(prevResults => [...prevResults, { timesFound, url }]);
            else
                setNotFound(prevNotFound => [...prevNotFound, { url }]);

            setIsLoading(false)
        })
    }

    const handleReset = () => {
        setResults([]);
        setNotFound([]);
    }

    const Results = () => {
        if (isLoading) {
            <p>Loading ...</p>
        }

        if (results.length === 0) {
            <p>No results found</p>
        }

        const totalHits = results.reduce((acc, result) => acc + result.timesFound, 0);
        const totalFound = results.length;

        return (
            <div className={styles.results}>
                <h2>Results</h2>
                <p>Code found {totalHits} time{totalHits > 1 && 's'} on {totalFound} page{totalFound > 1 && 's'}</p>
                <br />
                <ul>
                    {results
                        .map((result, index) => (
                            <li key={index}>
                                Found code {result.timesFound}x on <a href={result.url} target="_blank" rel="noreferrer">{result.url}</a>
                            </li>
                        ))}
                </ul>
                <br />
                <p>Not found on {notFound.length} page{notFound.length > 1 && 's'}</p>
                <br />
                <ul>
                    {notFound
                        .map((result, index) => (
                            <li key={index}>
                                Nothing found on {result.url}
                            </li>
                        ))}
                </ul>
            </div>
        )
    }

    const codePlaceholder = "Paste your code here. For example:\nclass=\"video-wrapper\"\n";
    const urlPlaceholder = "Paste your urls here. For example:\nhttps://www.google.com\nhttps://www.reddit.com\n...";

    return (
        <>
            <Head>
                <title>Code-finder</title>
                <meta name="description" content="Find code on webpages" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <h1 className={styles.title}>Code-finder</h1>

                <div className={styles.entry}>
                    <label
                        className={styles.label}
                        htmlFor="code">Paste your code here</label>
                    <textarea
                        id='code'
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className={styles.textarea}
                        placeholder={codePlaceholder} />
                </div>

                <div className={styles.entry}>
                    <label
                        className={styles.label}
                        htmlFor="urls">Paste your urls here</label>
                    <textarea
                        id='urls'
                        value={urls}
                        onChange={(e) => setUrls(e.target.value)}
                        className={styles.textarea}
                        placeholder={urlPlaceholder} />
                    <div className={styles.hint}>
                        <p>
                            One url per line &middot;
                            urls pasted: {(urls.length > 0) && urls.split('\n').length}
                        </p>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button
                        onClick={handleClick}
                        className={styles.button}>Find</button>
                    <button
                        onClick={handleReset}
                        className={styles.button}>Reset</button>
                </div>

                <Results />
            </main>
        </>
    )
}

export default Home;
