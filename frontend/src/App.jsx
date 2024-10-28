import KanbanBoard from './components/KanbanBoard'
import styled from 'styled-components';

const Container = styled.div`
  width: 100%; 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 0 20px; 
`

function App() {
  return (
    <>
      <Container>
        <KanbanBoard />
      </Container>
    </>
  )
}

export default App
