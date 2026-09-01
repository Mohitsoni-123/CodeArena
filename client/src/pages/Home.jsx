import { Link } from "react-router-dom";

const Home = () => {
  return (
    // <div>
    //   <h1>Welcome to CodeArena</h1>

    //   <p>Practice coding problems and improve your problem-solving skills</p>

    //   <Link to="/problems">
    //     Explore Problems
    //   </Link>
    // </div>

    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-tag">🚀 Practice. Code. Improve.</p>
          <h1>
            Master Coding with
            <span> CodeArena</span>
          </h1>
          <p className="hero-description">
            Practice coding problems, test your solutions, track your
            submissions, and improve your problem-solving skills.
          </p>

          <div className="hero-buttons">
            <Link to="/problems" className="primary-btn">
              Start Coding →
            </Link>

            <Link to="/submissions" className="secondary-btn">
              View Submissions
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="code-header">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <pre>
            <code>{`#include <iostream>
using namespace std;

int main() {
    cout << "Hello CodeArena!";
    return 0;
}`}</code>
          </pre>
        </div>
      </section>

      <section className="features">
        <div className="section-heading">
          <p>WHY CODEARENA?</p>
          <h2>Everything you need to practice</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💻</div>
            <h3>Practice Problems</h3>
            <p>
              Solve coding problems across different topics and difficulty
              levels
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Run Your Code</h3>
            <p>
              Execute your code with custom input and instantly see the output.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>View your submissions and keep track of your coding journey.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Start Coding?</h2>
        <p>
          Challenge yourself and improve your problems-solving skills today.
        </p>
        <Link to="/problems" className="primary-btn">
          Explore Problems →
        </Link>
      </section>
    </div>
  );
};

export default Home;
