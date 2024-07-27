import { useState, useEffect } from 'react'
import axios from 'axios'
import './Home.scss'
import ModifierBoard from '../ModifierBoard'
import RainToggleButton from '../RainToggleButton'
import Footer from '../../layout/Footer'
import { useTimer } from 'react-timer-hook'
import { useAppSelector } from '../../store/store'
import { useLocation } from 'react-router-dom'

const BASE_URL = 'http://165.246.44.237:8000/'

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const Home = () => {
  const [timerStart, setTimerStart] = useState(false)
  const [combineMode, setCombineMode] = useState<string>('day-clear') // Default mode
  const [diaryData, setDiaryData] = useState<any>(null) // Specify a more detailed type if known
  const [recommendedMusic, setRecommendedMusic] = useState<any[]>([]) // State for recommended music
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split('T')[0]
  ) // YYYY-MM-DD 형식

  const daynight = useAppSelector(state => state.mode)
  const rain = useAppSelector(state => state.rain)
  const location = useLocation()

  const { mode } = daynight
  const { rainMode } = rain

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const selectedDate = queryParams.get('selectedDate')
    console.log(selectedDate)

    if (selectedDate) {
      const fetchDiary = async () => {
        try {
          const response = await apiClient.get('/diary/get', {
            params: { date: selectedDate },
          })
          console.log('Full response:', response)
          console.log('Data:', response.data)

          // Set diary data
          setDiaryData(response.data)

          // Extract recommended music and update state
          if (
            response.data &&
            response.data.data &&
            response.data.data.recommended_music
          ) {
            setRecommendedMusic(response.data.data.recommended_music)
          } else {
            setRecommendedMusic([])
          }

          // Update combineMode based on the feeling data
          if (response.data && response.data.data.feeling) {
            const feeling = response.data.data.feeling
            console.log('Feeling:', feeling)

            switch (feeling) {
              case '화남':
              case '상처':
              case '슬픔':
                setCombineMode('night-rain')
                break
              default:
                setCombineMode('day-clear')
                break
            }
          } else {
            console.warn('Feeling data is not available')
            setCombineMode('day-clear')
          }
        } catch (error) {
          console.error('Error fetching diary:', error)
        }
      }

      fetchDiary()
    }
  }, [location.search]) // location.search가 변경될 때마다 useEffect 실행

  const expiryTimestamp = new Date()
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 0)

  const { seconds, minutes, hours, isRunning, pause, resume, restart } =
    useTimer({
      expiryTimestamp,
      onExpire: () => setTimerStart(false),
    })

  const setTimerHandler = (hour: number, minute: number, second: number) => {
    const time = new Date()
    const setupTimer =
      Number(hour) * 3600 + Number(second) + Number(minute) * 60
    time.setSeconds(time.getSeconds() + setupTimer)
    restart(time)
  }

  return (
    <>
      {/* Embedded the background video based on each state */}
      <video
        className={combineMode === 'night-clear' ? 'videoIn' : 'videoOut'}
        autoPlay
        loop
        muted
      >
        <source src="/assets/video/Night-clear.mp4" type="video/mp4" />
      </video>
      <video
        className={combineMode === 'night-rain' ? 'videoIn' : 'videoOut'}
        autoPlay
        loop
        muted
      >
        <source src="/assets/video/Night-rainny.mp4" type="video/mp4" />
      </video>
      <video
        className={combineMode === 'day-clear' ? 'videoIn' : 'videoOut'}
        autoPlay
        loop
        muted
      >
        <source src="/assets/video/Day-sunny.mp4" type="video/mp4" />
      </video>
      <video
        className={combineMode === 'day-rain' ? 'videoIn' : 'videoOut'}
        autoPlay
        loop
        muted
      >
        <source src="/assets/video/Day-rainny.mp4" type="video/mp4" />
      </video>
      <RainToggleButton />
      <ModifierBoard
        seconds={seconds}
        minutes={minutes}
        hours={hours}
        isRunning={isRunning}
        pause={pause}
        resume={resume}
        restart={restart}
        setTimerHandler={setTimerHandler}
        setTimerStart={setTimerStart}
        timerStart={timerStart}
      />
      <Footer recommendedMusic={recommendedMusic} />
    </>
  )
}

export default Home
