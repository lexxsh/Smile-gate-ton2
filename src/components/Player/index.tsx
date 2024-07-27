import React from 'react'
import './styles.scss'

export interface IPlayerProps {
  currentSongIndex: number
  setCurrentSongIndex: React.Dispatch<React.SetStateAction<number>>
  songs: { youtube_embed: string; title: string }[]
}

const Player = ({
  currentSongIndex,
  setCurrentSongIndex,
  songs,
}: IPlayerProps) => {
  const handlePlayPause = () => {
    const currentSong = songs[currentSongIndex]
    if (currentSong) {
      console.log('Playing URL:', currentSong.youtube_embed) // 콘솔에서 링크 확인
      window.open(currentSong.youtube_embed, '_blank', 'noopener,noreferrer')
    } else {
      console.error('Current song is undefined or null')
    }
  }

  const SkipSong = (forwards = true) => {
    setCurrentSongIndex(prevIndex => {
      let newIndex = prevIndex + (forwards ? 1 : -1)
      if (newIndex < 0) {
        newIndex = songs.length - 1
      } else if (newIndex >= songs.length) {
        newIndex = 0
      }
      return newIndex
    })
  }

  return (
    <div className="music-player">
      <div className="music-player--controls">
        <button className="skip-btn" onClick={() => SkipSong(false)}>
          <img src="/assets/icons/prev.svg" alt="Previous" />
        </button>
        <button className="play-btn" onClick={handlePlayPause}>
          <img src="/assets/icons/play.svg" alt="Play" />
        </button>
        <button className="skip-btn" onClick={() => SkipSong(true)}>
          <img src="/assets/icons/next.svg" alt="Next" />
        </button>
      </div>
    </div>
  )
}

export default Player
