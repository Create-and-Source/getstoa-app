import { Routes, Route } from 'react-router-dom'
import TabBar from './components/TabBar'
import Home from './pages/Home'
import Community from './pages/Community'
import Mind from './pages/Mind'
import Progress from './pages/Progress'
import Profile from './pages/Profile'
import VisionBoard from './pages/VisionBoard'
import Journal from './pages/Journal'
import Stillness from './pages/Stillness'
import Workout from './pages/Workout'
import Playlist from './pages/Playlist'
import SleepStory from './pages/SleepStory'

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
        <Route path="/journal" element={<Journal />} />
        <Route path="/stillness" element={<Stillness />} />
        <Route path="/workout/:slug?" element={<Workout />} />
        <Route path="/playlist/:slug?" element={<Playlist />} />
        <Route path="/sleep/:slug?" element={<SleepStory />} />
      </Routes>
      <TabBar />
    </div>
  )
}
