// src/layout/Footer/index.tsx
import React, { useState, useEffect } from 'react'
import { useAppSelector } from '../../store/store'
import { RootState } from '../../store/store'
import { fetchVideoTitle } from './fetchYoutube'
import './styles.scss'
import { CONSTANTS } from '../../constants/constants'
import Player from '../../components/Player' // Import Player component

const Footer = () => {
  const data = useAppSelector((state: RootState) => state.mood)
  const { moodMode } = data

  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [videoId, setVideoId] = useState<string>('')
  const [videoTitle, setVideoTitle] = useState<string>('로딩 중...')
  const [songs, setSongs] = useState<any[]>([])

  useEffect(() => {
    const getQueryFromMood = () => {
      switch (moodMode) {
        case 'chill':
          return 'chill music'
        case 'jazzy':
          return 'jazz music'
        case 'sleep':
          return 'sleep music'
        default:
          return 'music'
      }
    }

    const loadVideoId = async () => {
      const query = getQueryFromMood()
      const exampleVideoId = 'dQw4w9WgXcQ' // Example video ID
      setVideoId(exampleVideoId)

      const title = await fetchVideoTitle(exampleVideoId)
      setVideoTitle(title)

      // Set songs for the player
      setSongs([
        { src: `https://www.youtube.com/watch?v=${exampleVideoId}`, title },
      ])
    }

    loadVideoId()
  }, [moodMode])

  return (
    <div className="footer">
      <div className="song-name">
        <span>곡 이름: {videoTitle}</span>
      </div>
      <Player
        currentSongIndex={currentSongIndex}
        setCurrentSongIndex={setCurrentSongIndex}
        songs={songs} // Pass songs to Player
      />
      <div className="author">
        제작자:
        <a
          href={CONSTANTS.AUTHOR_GITHUB_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="author-name"
        >
          {CONSTANTS.AUTHOR}
        </a>
      </div>
    </div>
  )
}

export default Footer
