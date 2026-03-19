import { Routes, Route } from 'react-router-dom'
import TabBar from './components/TabBar'
import Home from './pages/Home'
import Train from './pages/Train'
import Mind from './pages/Mind'
import Progress from './pages/Progress'
import Profile from './pages/Profile'

export default function App() {
  return (
    <div style={{
      maxWidth: 430,
      margin: '0 auto',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: '#0D0D0D',
    }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/train" element={<Train />} />
        <Route path="/mind" element={<Mind />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <TabBar />
    </div>
  )
}
