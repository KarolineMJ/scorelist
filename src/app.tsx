import { useEffect, useState } from 'react'
import { Container, Box, H1, H2, Grid, GridItem } from '@northlight/ui'

import { ExcelDropzone, ExcelRow } from './excel-dropzone.jsx'
import ScoreList, { ScoreData } from './components/ScoreList.tsx'
import users from './users.ts'
import scores from './scores.ts'
import ScoreForm from './components/ScoreForm.tsx'

const getInitialUsers = () => {
  return users
    .map(user => {
      const userScores = scores
        .filter(score => score.userId === user._id)
        .map(score => score.score)
      const maxScore = Math.max(...userScores, 0)
      return {
        id: user._id,
        name: user.name,
        scores: userScores,
        bestScore: maxScore,
      }
    })
    .sort((a, b) => b.bestScore - a.bestScore)
}

export default function App() {
  const [scoreData, setScoreData] = useState<ScoreData[]>(getInitialUsers())

  const handleSheetData = (data: ExcelRow[]) => {
    setScoreData(prevData => {
      const updatedData = [...prevData]

      data.forEach(row => {
        const { name, score } = row
        const existingUser = updatedData.find(user => user.name === name)

        if (existingUser) {
          existingUser.scores.push(score)
          existingUser.bestScore = Math.max(...existingUser.scores)
        } else {
          updatedData.push({
            id: Date.now(),
            name,
            scores: [score],
            bestScore: score,
          })
        }
      })

      return updatedData.sort((a, b) => b.bestScore - a.bestScore)
    })
  }

  useEffect(() => {
    const initialUsers = getInitialUsers()
    setScoreData(initialUsers)
  }, [])

  return (
    <Container maxW="6xl" padding="4">
      <H1 marginBottom="4">Score list</H1>
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap={10}
      >
        <GridItem rowSpan={2} colSpan={1}>
          <H2 style={{ marginBottom: '20px' }}>Drop your scores here!</H2>
          <ExcelDropzone
            onSheetDrop={handleSheetData}
            label="Import excel file here"
          />
        </GridItem>
        <GridItem colSpan={2} gap={4}>
          <Box>
            <H2 style={{ marginBottom: '20px' }}>Add New Score</H2>
            <ScoreForm setScoreData={setScoreData} />
          </Box>
          <Box>
            <H2 style={{ marginBottom: '20px' }}>Player scores</H2>
          </Box>
          <Box>
            <ScoreList scoreData={scoreData} />
          </Box>
        </GridItem>
      </Grid>
    </Container>
  )
}
