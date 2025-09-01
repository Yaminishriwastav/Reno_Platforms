import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSchools = async () => {
      try {
        const res = await fetch("/api/get-schools");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load");
        setSchools(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Error fetching");
      } finally {
        setLoading(false);
      }
    };
    loadSchools();
  }, []);

  return (
    <div className="home">
      <header>
        <img src="/logo.png" alt="Reno Logo" className="logo" />
        <h1>Reno Assignment</h1>
      </header>

      <nav className="nav">
        <Link href="/showSchools">📖 Show Schools🏫</Link> |{" "}
        <Link href="/addSchool">➕ Add School🏫</Link>
      </nav>

      <section className="school-grid">
        {loading && <p>Loading…</p>}
        {error && <p className="err">{error}</p>}
        {!loading && !error && schools.length === 0 && <p>No schools found.</p>}
        {!loading && !error && schools.length > 0 && (
          <div className="grid">
            {schools.map((s) => (
              <div key={s.id} className="card">
                {s.image && <img src={s.image} alt={s.name} />}
                <h3>{s.name}</h3>
              </div>
            ))}
          </div>
        )}
      </section>

     <style jsx>{`
  .home { 
    text-align: center; 
    padding: 40px; 
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #f0f4f9, #e8efff);
    min-height: 100vh;
  }

  header {
    margin-bottom: 30px;
  }

  .logo { 
    width: 90px; 
    margin-bottom: 10px; 
    border-radius: 50%; 
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  }

  h1 { 
    font-size: 32px; 
    margin: 10px 0; 
    color: #333;
  }

  .nav {
    margin-bottom: 25px;
  }

  .nav a { 
    margin: 0 15px; 
    font-size: 18px; 
    color: #0070f3; 
    text-decoration: none; 
    font-weight: bold;
  }

  .nav a:hover { 
    text-decoration: underline; 
    color: #0051a1;
  }

  .school-grid { 
    margin-top: 20px; 
  }

  .grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); 
    gap: 25px; 
    justify-items: center; 
  }

  .card { 
    background: #fff; 
    padding: 15px; 
    border-radius: 12px; 
    box-shadow: 0 4px 10px rgba(0,0,0,0.1); 
    width: 220px; 
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0,0,0,0.2);
  }

  .card img { 
    width: 100%; 
    height: 130px; 
    object-fit: cover; 
    border-radius: 8px; 
  }

  .card h3 { 
    font-size: 18px; 
    margin-top: 12px; 
    color: #444;
  }

  .err { 
    color: red; 
    font-weight: bold;
  }
`}</style>

    </div>
  );
}
