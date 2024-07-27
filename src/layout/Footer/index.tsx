import React, { useState, useEffect } from 'react'
import { useAppSelector } from '../../store/store'
import { RootState } from '../../store/store'
import { fetchVideoTitle } from './fetchYoutube'
import './styles.scss'
import { CONSTANTS } from '../../constants/constants'
import Player from '../../components/Player'

interface RecommendedMusic {
  youtube_embed: string // YouTube embed link
  title: string
}

interface FooterProps {
  recommendedMusic: RecommendedMusic[]
}

const Footer: React.FC<FooterProps> = ({ recommendedMusic }) => {
  const data = useAppSelector((state: RootState) => state.mood)
  const { moodMode } = data

  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [videoTitle, setVideoTitle] = useState<string>('로딩 중...')
  const [songs, setSongs] = useState<RecommendedMusic[]>([])

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
      if (recommendedMusic.length > 0) {
        // Set the title of the current song
        const currentSong = recommendedMusic[currentSongIndex]
        if (currentSong) {
          setVideoTitle(currentSong.title)
          setSongs(recommendedMusic)
        }
      } else {
        const query = getQueryFromMood()
        const exampleVideoId = 'dQw4w9WgXcQ' // Example video ID
        setVideoTitle('로딩 중...')

        const title = await fetchVideoTitle(exampleVideoId)
        setVideoTitle(title)

        setSongs([
          {
            youtube_embed: `https://www.youtube.com/embed/${exampleVideoId}`,
            title,
          },
        ])
      }
    }

    loadVideoId()
  }, [moodMode, recommendedMusic, currentSongIndex])

  useEffect(() => {
    if (recommendedMusic.length > 0 && recommendedMusic[currentSongIndex]) {
      setVideoTitle(recommendedMusic[currentSongIndex].title)
    }
  }, [currentSongIndex, recommendedMusic])

  return (
    <div className="footer">
      <div className="song-name">
        <span>곡 이름: {videoTitle}</span>
      </div>
      <Player
        currentSongIndex={currentSongIndex}
        setCurrentSongIndex={setCurrentSongIndex}
        songs={recommendedMusic} // Pass recommendedMusic here
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
