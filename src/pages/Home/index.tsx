import { useState, useEffect } from 'react'
import axios from 'axios'
import './styles.scss'
import ModifierBoard from '../../components/ModifierBoard'
import RainToggleButton from '../../components/RainToggleButton'
import Footer from '../../layout/Footer'
import { useTimer } from 'react-timer-hook'
import { RootState, useAppSelector } from '../../store/store'
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
  const [diaryData, setDiaryData] = useState<any>(null)
  const [combineMode, setCombineMode] = useState<string>('day-clear') // Default mode
  const [recommendedMusic, setRecommendedMusic] = useState<any[]>([]) // State for recommended music

  const daynight = useAppSelector((state: RootState) => state.mode)
  const rain = useAppSelector((state: RootState) => state.rain)
  const location = useLocation()

  const { mode } = daynight
  const { rainMode } = rain

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const selectedDate = queryParams.get('selectedDate')

    if (selectedDate) {
      const fetchDiary = async () => {
        try {
          const response = await apiClient.get('/diary/get', {
            params: { date: selectedDate },
          })
          console.log('Full response:', response)
          console.log('Data:', response.data)
          console.log('Data:', response.data.data.content)

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

          setDiaryData(response.data)
          setRecommendedMusic(response.data.data.recommended_music || []) // Update recommended_music state
        } catch (error) {
          console.error('Error fetching diary:', error)
        }
      }

      fetchDiary()
    }
  }, [location.search])

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
      <Footer recommendedMusic={recommendedMusic} />{' '}
      {/* Pass the recommendedMusic prop */}
    </>
  )
}

export default Home
