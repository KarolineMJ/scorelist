import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { ChevronDownDuo, ChevronRightDuo } from '@northlight/icons'
import { Fragment } from 'react'
import { useState } from 'react'

export interface ScoreData {
  id: number
  name: string
  scores: number[]
  bestScore: number
}

const ScoreList = ({ scoreData }: { scoreData: ScoreData[] }) => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  const handleUserClick = (userId: number) => {
    setSelectedUserId(selectedUserId === userId ? null : userId) // Toggle user selection
  }

  return (
    <div>
      <Table variant="striped" style={{ cursor: 'pointer' }}>
        <Thead>
          <Tr>
            <Th w="6" />
            <Th>Name</Th>
            <Th>Score</Th>
          </Tr>
        </Thead>
        <Tbody>
          {scoreData.map((user, index) => (
            <Fragment key={index}>
              <Tr key={index} onClick={() => handleUserClick(user.id)}>
                <Td>
                  {selectedUserId === user.id ? (
                    <ChevronDownDuo color="#b5b5b5" />
                  ) : (
                    <ChevronRightDuo color="#b5b5b5" />
                  )}
                </Td>
                <Td>{user.name}</Td>
                <Td>{user.bestScore}</Td>
              </Tr>
              {selectedUserId === user.id &&
                user.scores
                  .sort((a, b) => b - a)
                  .map((score, idx) => (
                    <Tr key={`${user.id}-${idx}`}>
                      <Td />
                      <Td>-</Td>
                      <Td>{score}</Td>
                    </Tr>
                  ))}
            </Fragment>
          ))}
        </Tbody>
      </Table>
    </div>
  )
}

export default ScoreList
