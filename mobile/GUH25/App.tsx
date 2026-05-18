import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/store';
import FontProvider from './src/utils/FontProvider';
import Routing from './src/routing/Routing';
import Main from './Main';
import './src/firebase'

export default function App() {

    return (
        <Provider store={store}>
            <Main />
        </Provider>
    );
}
