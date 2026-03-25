import { Route, Routes } from 'react-router-dom';
import { routes } from './routes';

function App() {
  return (
    <Routes>
      {routes.map((route) => (
        <Route 
          key={route.path} 
          path={route.path}
          element={
            <main>
              {route.element} 
            </main>
          } 
        />
      ))}
    </Routes>
  );
}

export default App;