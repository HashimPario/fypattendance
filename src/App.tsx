import Page from 'components/Layout/Page';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';
import { createStandaloneToast } from '@chakra-ui/react';
import CustomRoutes from 'routes';
const { ToastContainer } = createStandaloneToast();

function App() {
  console.log(
    '%c<%c%cSMART ATTENDANCE SYSTEM%c%c />',
    'font-size: 40px; color: #f1c40f;',
    'font-size: 40px; color: #3498db;',
    'font-size: 60px; color: #f1c40f; font-weight: bold; text-shadow: 2px 2px 0 #3498db;',
    'font-size: 40px; color: #3498db;',
    'font-size: 40px; color: #f1c40f;',
  );

  console.log(
    '%cStop!',
    'font-size: 24px; color: #e74c3c; font-weight: bold; text-shadow: 1px 1px 0 #f1c40f;',
  );
  console.log(
    '%cOpening the browser console and engaging in hacking activities is not a good thing. It may be subject to legal action!',
    'font-size: 16px; color: #e74c3c; font-weight: bold;',
  );

  return (
    <>
      <Page>
        <CustomRoutes />
      </Page>
      <ToastContainer />
    </>
  );
}

export default App;
