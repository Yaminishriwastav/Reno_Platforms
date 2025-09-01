import Link from "next/link";
import { useEffect, useState } from "react";

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const load = async () => {
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
    load();
  }, []);

  // 🔎 Apply search, filter, sort
  const filtered = schools
    .filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.city.toLowerCase().includes(search.toLowerCase()) ||
        s.state.toLowerCase().includes(search.toLowerCase())
    )
    .filter((s) => (filter ? s.state === filter : true))
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "city"
        ? a.city.localeCompare(b.city)
        : a.state.localeCompare(b.state)
    );

  return (
    <div className="container">
      <div className="header">
        <h1>Schools Directory</h1>
        <nav className="nav">
          <Link href="/">🏠 Home</Link> |{" "}
          <Link href="/addSchool">➕ Add School</Link>
        </nav>
      </div>

      {/* Controls */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search by name, city, state..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select onChange={(e) => setSort(e.target.value)} value={sort}>
          <option value="name">Sort by Name</option>
          <option value="city">Sort by City</option>
          <option value="state">Sort by State</option>
        </select>
        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="">All States</option>
          {[...new Set(schools.map((s) => s.state))].map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="err">{error}</p>}

      {!loading && !error && (
        <div className="grid">
          {filtered.length === 0 && <p>No schools found.</p>}
          {filtered.map((s) => (
            <article key={s.id} className="card">
              {s.image && <img src={s.image} alt={s.name} />}
              <h3 className="title">{s.name}</h3>
              <p className="sub">{s.address}, {s.city}, {s.state}</p>
              <p className="sub">📞 {s.contact}</p>
              <p className="sub">✉️ {s.email_id}</p>

              {/* Apply button */}
              {s.website ? (
                <a
                  href={s.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                >
                  Apply Online
                </a>
              ) : (
                <div className="contact-options">
                  <a href={`mailto:${s.email_id}`} className="btn">Contact by Mail</a>
                  <a href={`tel:${s.contact}`} className="btn">Call Now</a>
                  <span className="btn disabled">Visit Us</span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <style jsx>{`
        .container { padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: center; }
        .controls { margin: 20px 0; display: flex; gap: 10px; }
        .controls input, .controls select { padding: 8px; border: 1px solid #ccc; border-radius: 6px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
        .card { background: #fff; padding: 15px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
        .card img { width: 100%; height: 150px; object-fit: cover; border-radius: 8px; }
        .title { font-size: 18px; margin-top: 10px; }
        .sub { color: #555; font-size: 14px; }
        .btn { display: inline-block; margin-top: 10px; padding: 8px 12px; background: #0070f3; color: white; border-radius: 5px; text-decoration: none; }
        .btn:hover { background: #0059c1; }
        .btn.disabled { background: #ccc; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
