export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand-name" style={{ marginBottom: '0.5rem' }}>
              Review<span>Hub</span>
            </div>
            <p className="section-desc" style={{ maxWidth: '42ch' }}>
              Android অ্যাপ ও ওয়েবসাইটের নির্ভরযোগ্য তথ্য, ১–৫ স্টার রেটিং এবং কমিউনিটি রিভিউ প্ল্যাটফর্ম।
              Guest ব্যবহারকারীরা লগইন ছাড়াই সব পাবলিক কন্টেন্ট দেখতে পারবেন।
            </p>
          </div>

          <div>
            <h3 className="footer-heading">Homepage Sections</h3>
            <div className="footer-links">
              <a href="#top">Search &amp; Overview</a>
              <a href="#trending">Trending Apps &amp; Websites</a>
              <a href="#categories">Categories</a>
              <a href="#featured">Featured Discovery</a>
              <a href="#top-rated">Top Rated List</a>
            </div>
          </div>

          <div>
            <h3 className="footer-heading">Platform Status</h3>
            <div className="footer-links">
              <span>Frontend Phase: Homepage UI</span>
              <span>Data Mode: Static Demo Catalog</span>
              <span>Theme: Black + Neon Green</span>
              <span>Guest Access: Active</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 ReviewHub. Built with Vite, React &amp; TypeScript.</span>
          <span>Zero-Cost Architecture • Mobile-First Responsive</span>
        </div>
      </div>
    </footer>
  );
}
