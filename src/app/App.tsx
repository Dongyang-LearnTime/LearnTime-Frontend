import { RouterProvider } from 'react-router';
import { router } from './routes';

<<<<<<< Updated upstream
export default function App() {
  return <RouterProvider router={router} />;
=======
import { routes } from './routes';

function App() {
  return (
    <>

      {/* routes.tsx 배열에 정의한 설정한 경로로 페이지를 만듦 */}
      <Routes>
        {
          routes.map(route => (
            <Route 
              key={route.path} 
              path={route.path}
              element={
                <main>
                  {route.element} 
                </main>
              } 
            />
          ))
        }
      </Routes>

    </>
  )
>>>>>>> Stashed changes
}
