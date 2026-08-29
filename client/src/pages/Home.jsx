import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h1>Welcome to CodeArena</h1>

      <p>Practice coding problems and improve your problem-solving skills</p>

      <Link to="/problems">
        Explore Problems
      </Link>
    </div>
  )
}

export default Home
