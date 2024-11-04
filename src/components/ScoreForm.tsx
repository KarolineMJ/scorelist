import { Button, Form, Grid, GridItem, TextField } from '@northlight/ui'
import Joi from 'joi'
import { useState } from 'react'
import { ScoreData } from './ScoreList'

const ScoreFormSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  score: Joi.number().min(1).integer().required(),
})

const ScoreForm = ({
  setScoreData,
}: {
  setScoreData: (value: React.SetStateAction<ScoreData[]>) => void
}) => {
  const [formData, setFormData] = useState<{
    name: string
    score: number | null
  }>({ name: '', score: null })

  // Update form data as user types
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | string,
  ) => {
    const { name, value } = (e as React.ChangeEvent<HTMLInputElement>).target
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleFormSubmit = () => {
    const { name, score } = formData
    if (!score) return
    const scoreNum = parseInt(score.toString(), 10)

    setScoreData(prevData => {
      const updatedData = [...prevData]
      const existingUser = updatedData.find(user => user.name === name)
      if (existingUser) {
        // Update existing user
        existingUser.scores.push(scoreNum)
        existingUser.bestScore = Math.max(...existingUser.scores)
      } else {
        // Add new user
        updatedData.push({
          id: Date.now(),
          name,
          scores: [scoreNum],
          bestScore: scoreNum,
        })
      }
      return updatedData.sort((a, b) => b.bestScore - a.bestScore) // Sort after updating
    })

    setFormData({ name: '', score: null }) // Reset form
  }
  return (
    <Form
      initialValues={{ name: '', score: 0 }}
      onSubmit={handleFormSubmit}
      joiSchema={ScoreFormSchema}
      innerFormStyle={{ marginBottom: '40px' }}
    >
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(5, 1fr)',
          lg: 'repeat(5, 1fr)',
        }}
        gap={{ base: 0, md: 4, lg: 4 }}
      >
        <GridItem colSpan={2} marginBottom={{ sm: '10px' }}>
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </GridItem>
        <GridItem colSpan={2}>
          <TextField
            name="score"
            label="Score"
            type="number"
            min={1}
            value={formData.score || ''}
            onChange={handleInputChange}
          />
        </GridItem>
        <GridItem colSpan={1} style={{ marginTop: '26px' }}>
          <Button type="submit" style={{ width: '100%' }}>
            Add
          </Button>
        </GridItem>
      </Grid>
    </Form>
  )
}

export default ScoreForm
