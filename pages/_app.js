import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <header style={{
        backgroundColor: '#161b22',
        padding: '1rem 2rem',
        borderBottom: '1px solid #30363d',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#e6edf3' }}>
          📊 Stock Analytics Demo
        </h1>
      </header>

      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}

