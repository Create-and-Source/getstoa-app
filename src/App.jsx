import { Routes, Route } from 'react-router-dom'
import TabBar from './components/TabBar'
import Home from './pages/Home'
import Community from './pages/Community'
import Mind from './pages/Mind'
import Progress from './pages/Progress'
import Profile from './pages/Profile'
import VisionBoard from './pages/VisionBoard'

export default function App() {
  return (
    <div style={{
      maxWidth: 430,
      margin: '0 auto',
      height: '100dvh',
      position: 'relative',
      overflow: 'hidden',
      background: '#0D0D0D',
    }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/community" element={<Community />} />
        <Route path="/mind" element={<Mind />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/vision" element={<VisionBoard />} />
      </Routes>
      <TabBar />
    </div>
  )
}
