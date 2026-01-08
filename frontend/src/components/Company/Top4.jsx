export function CompanyStats() {
  return (
    <section className="cp-stats-section">
      <div className="container">
        <h2 className="cp-stats-title text-center">
          Company in numbers
        </h2>

        <div className="row justify-content-center cp-stats-row">
          <div className="col-md-4">
            <div className="cp-stat-item">
              <div className="cp-stat-icon cp-heart">❤</div>
              <div className="cp-stat-content">
                <h3>30,000+</h3>
                <p>brands use our platform</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="cp-stat-item">
              <div className="cp-stat-icon cp-globe">🌍</div>
              <div className="cp-stat-content">
                <h3>150+</h3>
                <p>customer countries</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="cp-stat-item">
              <div className="cp-stat-icon cp-users">👥</div>
              <div className="cp-stat-content">
                <h3>1Billion+</h3>
                <p>visitors served per day</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
