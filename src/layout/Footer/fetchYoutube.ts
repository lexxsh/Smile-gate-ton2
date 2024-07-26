// src/layout/Footer/fetchYoutube.ts
import { YouTubeVideo } from '../../types/interface' // Adjust the path as necessary

const MAX_RESULTS = 5

export const fetchVideoTitle = async (videoId: string): Promise<string> => {
  const apiKey = 'AIzaSyDOD2iNEKiXF1B3t1_GmwlYQBQkrqP18sA' // YouTube Data API 키
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    if (data.items.length > 0) {
      return data.items[0].snippet.title
    } else {
      return '제목 없음'
    }
  } catch (error) {
    console.error('비디오 제목을 가져오는 데 실패했습니다:', error)
    return '제목 없음'
  }
}
